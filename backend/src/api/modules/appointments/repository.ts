import { ICreateAppointment, IAppointment } from './types';
import Appointment from './model';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';
import Service from '../services/model';
import { Transaction } from '@sequelize/core';

export default class AppointmentRepository extends DefaultRepository<Appointment> implements BaseRepository<IAppointment, ICreateAppointment> {
    _model;

    constructor(model: typeof Appointment) {
        super();
        this._model = model;
    }

    async findUnassignedByServiceTypes(serviceTypeIds: string[], options?: { t: Transaction }) {
        return this._model.findAll({
            where: {
                staffId: null,
            },
            include: [
                {
                    model: Service,
                    where: {
                        serviceTypeId: serviceTypeIds,
                    },
                    required: true,
                },
            ],
            order: [['appointmentDateTime', 'ASC']],
            transaction: options?.t,
        });
    }
}
