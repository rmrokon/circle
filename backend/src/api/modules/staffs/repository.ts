import { ICreateStaff, IStaff } from './types';
import Staff from './model';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';

export default class StaffRepository extends DefaultRepository<Staff> implements BaseRepository<IStaff, ICreateStaff> {
    _model;

    constructor(model: typeof Staff) {
        super();
        this._model = model;
    }
}
