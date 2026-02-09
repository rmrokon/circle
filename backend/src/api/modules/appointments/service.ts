import { Op, Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils/index';
import { IAppointment } from './types';
import { IAppointmentRequestBody } from './validations';
import AppointmentRepository from './repository';
import { staffService, serviceService, activityService } from '../bootstrap';
import { ActivityType } from '../activities/types';

export interface IAppointmentService {
    createAppointment(body: IAppointmentRequestBody, options?: { t: Transaction }): Promise<IAppointment>;
    getAppointments(query: Record<string, unknown>, options?: { t: Transaction }): Promise<IAppointment[]>;
    updateAppointment(
        query: Partial<IAppointmentRequestBody> & { id: string },
        body: Partial<IAppointmentRequestBody>,
        options?: { t: Transaction },
    ): Promise<IDataValues<IAppointment>>;
    findAppointmentById(id: string, options?: { t: Transaction }): Promise<IAppointment | null>;
    assignQueueToStaff(staffId: string, options?: { t: Transaction }): Promise<void>;
}

export default class AppointmentService implements IAppointmentService {
    _repo: AppointmentRepository;

    constructor(repo: AppointmentRepository) {
        this._repo = repo;
    }

    convertToJson(data: IDataValues<IAppointment>) {
        if (!data) return null;
        return {
            ...data?.dataValues,
        };
    }

    private async validateStaffAvailability(staffId: string, appointmentDateTime: string, serviceId: string, excludeAppointmentId?: string, options?: { t: Transaction }) {
        // 1. Get requested service
        const service = await serviceService.findServiceById(serviceId, options);
        if (!service) throw new Error('Service not found!');

        // 2. Fetch staff and check if they match the service type
        const staff = await staffService.findStaffById(staffId, options);
        if (!staff) throw new Error('Staff not found!');

        const serviceTypeId = (staff as any).serviceTypeId;
        if (serviceTypeId !== service.serviceTypeId) {
            const error: any = new Error(`This staff member cannot perform ${service.name}.`);
            error.statusCode = 400;
            throw error;
        }

        // 3. Get requested service duration and check overlap
        const duration = service.duration;
        const startTime = new Date(appointmentDateTime).getTime();
        const endTime = startTime + duration * 60000;

        // 4. Fetch staff appointments for the day
        const startOfDay = `${appointmentDateTime.slice(0, 10)}T00:00:00`;
        const endOfDay = `${appointmentDateTime.slice(0, 10)}T23:59:59`;
        const existingAppointments = await this._repo.findStaffAppointmentsWithServices(staffId, startOfDay, endOfDay, options);

        // 5. Check for overlap
        for (const existing of existingAppointments) {
            if (excludeAppointmentId && existing.id === excludeAppointmentId) continue;

            const existingStart = new Date((existing as any).appointmentDateTime).getTime();
            const existingDuration = (existing as any).Service?.duration || 0;
            const existingEnd = existingStart + existingDuration * 60000;

            if (startTime < existingEnd && existingStart < endTime) {
                // We have a conflict
                const error: any = new Error('This staff member already has an appointment at this time.');
                error.statusCode = 409;
                throw error;
            }
        }
    }

    async createAppointment(body: IAppointmentRequestBody, options?: { t: Transaction }) {
        if (body?.staffId) {
            // Check daily capacity
            const staffAppointmentsForToday = await staffService.findStaffAppointmentsOnDate({ id: body.staffId, date: body.appointmentDateTime }, options);
            if (staffAppointmentsForToday.appointments.length >= staffAppointmentsForToday.dailyCapacity) throw new Error(`${staffAppointmentsForToday.name} is not available for this date!`);

            // Check time conflict
            await this.validateStaffAvailability(body.staffId, body.appointmentDateTime, body.serviceId, undefined, options);
        }
        const appointment = await this._repo.create({ ...body, staffId: body.staffId || null }, options);

        // Log Activity
        await activityService.logActivity({
            type: ActivityType.APPOINTMENT_CREATED,
            message: `New appointment created for ${body.customerName}${body.staffId ? '' : ' (Waiting Queue)'}`,
            metadata: { appointmentId: (appointment as any).id, staffId: body.staffId }
        }, options);

        return this.convertToJson(appointment as IDataValues<IAppointment>)!;
    }

    async getAppointments(query: Record<string, unknown>, options?: { t: Transaction }) {
        const { unassigned, startDate, endDate, staffId, ...rest } = query;
        const whereQuery: any = { ...rest };
        let isUnassigned = false;

        if (unassigned === 'true' || unassigned === true) {
            isUnassigned = true;
            whereQuery.staffId = null;
        } else if (staffId) {
            whereQuery.staffId = staffId;
        }

        if (startDate || endDate) {
            const start = startDate ? `${(startDate as string).slice(0, 10)}T00:00:00` : undefined;
            const end = endDate ? `${(endDate as string).slice(0, 10)}T23:59:59` : (startDate ? `${(startDate as string).slice(0, 10)}T23:59:59` : undefined);

            if (start && end) {
                whereQuery.appointmentDateTime = {
                    [Op.between]: [start, end],
                };
            } else if (start) {
                whereQuery.appointmentDateTime = {
                    [Op.gte]: start,
                };
            } else if (end) {
                whereQuery.appointmentDateTime = {
                    [Op.lte]: end,
                };
            }
        }

        const appointments = await this._repo.find(whereQuery, options);

        if (isUnassigned || startDate || endDate) {
            appointments.sort((a, b) => new Date(a.appointmentDateTime).getTime() - new Date(b.appointmentDateTime).getTime());
        }

        return appointments.map((a) => this.convertToJson(a as unknown as IDataValues<IAppointment>)!);
    }

    async updateAppointment(
        query: Partial<IAppointmentRequestBody> & { id: string },
        body: Partial<IAppointmentRequestBody>,
        options?: { t: Transaction },
    ) {
        const existing = await this._repo.findById(query.id, options);
        if (body?.staffId && body?.appointmentDateTime && body?.serviceId) {
            await this.validateStaffAvailability(body.staffId, body.appointmentDateTime, body.serviceId, query.id, options);
        } else if (body?.staffId || body?.appointmentDateTime || body?.serviceId) {
            // If only some fields are updated, we need to fetch the existing data to perform the check
            if (existing) {
                const staffId = body.staffId || (existing as any).staffId;
                const appointmentDateTime = body.appointmentDateTime || (existing as any).appointmentDateTime;
                const serviceId = body.serviceId || (existing as any).serviceId;
                if (staffId && appointmentDateTime && serviceId) {
                    await this.validateStaffAvailability(staffId, appointmentDateTime, serviceId, query.id, options);
                }
            }
        }
        const appointment = await this._repo.update(query, body, options);

        if (existing && !(existing as any).staffId && body.staffId) {
            const staff = await staffService.findStaffById(body.staffId, options);
            await activityService.logActivity({
                type: ActivityType.QUEUE_ASSIGNED,
                message: `Staff ${staff?.name || 'Unknown'} assigned to ${(appointment as any).customerName}`,
                metadata: { appointmentId: query.id, staffId: body.staffId }
            }, options);
        }

        if (body.status === 'Cancelled') {
            await activityService.logActivity({
                type: ActivityType.APPOINTMENT_CANCELLED,
                message: `Appointment for ${(appointment as any).customerName} was cancelled`,
                metadata: { appointmentId: query.id }
            }, options);
        }

        return appointment as IDataValues<IAppointment>;
    }

    async findAppointmentById(id: string, options?: { t: Transaction }) {
        const appointment = await this._repo.findById(id, options);
        return this.convertToJson(appointment as unknown as IDataValues<IAppointment>);
    }

    async assignQueueToStaff(staffId: string, options?: { t: Transaction }) {
        // 1. Get staff and their current assignments for the relevant dates
        const staff = await staffService.findStaffById(staffId, options);
        if (!staff || staff.available !== 'available') return;

        // In this system, we currently map one service type per staff in the service layer mapping, 
        // but the DB supports many. Let's use the mapped serviceTypeId.
        const serviceTypeId = (staff as any).serviceTypeId;
        if (!serviceTypeId) return;

        // 2. Fetch unassigned appointments for this service type
        const queue = await this._repo.findUnassignedByServiceTypes([serviceTypeId], options);
        if (queue.length === 0) return;

        // 3. Try to assign as many as possible while respecting capacity
        // To do this accurately across multiple appointments on the same date,
        // we track local counts for this run.
        const capacityCheckCache: Record<string, number> = {};

        for (const appointment of queue) {
            const date = appointment.appointmentDateTime.slice(0, 10);

            if (capacityCheckCache[date] === undefined) {
                const staffOnDate = await staffService.findStaffAppointmentsOnDate({ id: staffId, date: appointment.appointmentDateTime }, options);
                capacityCheckCache[date] = staffOnDate.appointments.length;
            }

            if (capacityCheckCache[date] < staff.dailyCapacity) {
                await this._repo.update({ id: appointment.id }, { staffId }, options);
                capacityCheckCache[date]++;

                // Log Activity
                await activityService.logActivity({
                    type: ActivityType.QUEUE_ASSIGNED,
                    message: `Queue appointment for ${(appointment as any).customerName} auto-assigned to ${staff.name}`,
                    metadata: { appointmentId: appointment.id, staffId }
                }, options);
            }
        }
    }
}
