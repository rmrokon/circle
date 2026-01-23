import { Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils/index.js';
import { IAppointment } from './types.js';
import { IAppointmentRequestBody } from './validations.js';
import AppointmentRepository from './repository.js';

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
        const appointment = await this._repo.create(body, options);
        return this.convertToJson(appointment as IDataValues<IAppointment>)!;
    }

    async getAppointments(query: Record<string, unknown>, options?: { t: Transaction }) {
        const appointments = await this._repo.find(query, options);
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
