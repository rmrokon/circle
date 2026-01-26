import { ICreateStaff, IStaff } from './types';
import Staff from './model';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';
import { Op, Transaction, WhereOptions } from '@sequelize/core';
import Appointment from '../appointments/model';
import { AppointmentStatus } from '../appointments/types';
import ServiceType from '../service-types/model';

export default class StaffRepository extends DefaultRepository<Staff> implements BaseRepository<IStaff, ICreateStaff> {
    _model;

    constructor(model: typeof Staff) {
        super();
        this._model = model;
    }

    async findAll(query: WhereOptions<IStaff>, options?: { t: Transaction }) {
        const today = new Date().toISOString().slice(0, 10);
        const startOfDay = `${today}T00:00`;
        const endOfDay = `${today}T23:59:59`;

        return this._model.findAll({
            where: query,
            include: [
                {
                    model: Appointment,
                    as: 'appointments',
                    where: {
                        appointmentDateTime: {
                            [Op.between]: [startOfDay, endOfDay],
                        },
                        status: {
                            [Op.eq]: AppointmentStatus.Scheduled,
                        },
                    },
                    required: false
                },
                {
                    model: ServiceType,
                    as: 'serviceTypes',
                    required: false
                }
            ],
            transaction: options?.t,
        });
    }
}
