import { Op, Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils/index';
import { IAppointment } from './types';
import { IAppointmentRequestBody } from './validations';
import AppointmentRepository from './repository';
import { staffService } from '../bootstrap';

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

    async createAppointment(body: IAppointmentRequestBody, options?: { t: Transaction }) {
        if (body?.staffId) {
            const staffAppointmentsForToday = await staffService.findStaffAppointmentsOnDate({ id: body.staffId, date: body.appointmentDateTime }, options);
            if (staffAppointmentsForToday.appointments.length >= staffAppointmentsForToday.dailyCapacity) throw new Error(`${staffAppointmentsForToday.name} is not available for this date!`);
        }
        const appointment = await this._repo.create({ ...body, staffId: body.staffId || null }, options);
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
        const appointment = await this._repo.update(query, body, options);
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
            }
        }
    }
}
