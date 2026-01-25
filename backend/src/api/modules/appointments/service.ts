import { Transaction } from '@sequelize/core';
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
            const staffAppointmentsForToday = await staffService.findStaffAppointmentsForToday({ id: body.staffId, date: body.appointmentDateTime }, options);
            if (staffAppointmentsForToday.appointments.length >= staffAppointmentsForToday.dailyCapacity) throw new Error(`${staffAppointmentsForToday.name} is not available for this date!`);
        }
        const appointment = await this._repo.create({ ...body, staffId: body.staffId || null }, options);
        return this.convertToJson(appointment as IDataValues<IAppointment>)!;
    }

    async getAppointments(query: Record<string, unknown>, options?: { t: Transaction }) {
        const whereQuery = { ...query };
        let isUnassigned = false;

        if (whereQuery.unassigned === 'true' || whereQuery.unassigned === true) {
            isUnassigned = true;
            delete whereQuery.unassigned;
            whereQuery.staffId = null;
        }

        const appointments = await this._repo.find(whereQuery as any, options);

        if (isUnassigned) {
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
}
