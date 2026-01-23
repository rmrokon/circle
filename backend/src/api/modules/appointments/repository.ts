import { ICreateAppointment, IAppointment } from './types';
import Appointment from './model';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';

export default class AppointmentRepository extends DefaultRepository<Appointment> implements BaseRepository<IAppointment, ICreateAppointment> {
    _model;

    constructor(model: typeof Appointment) {
        super();
        this._model = model;
    }
}
