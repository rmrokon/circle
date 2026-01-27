import { ICreateActivity, IActivity } from './types';
import Activity from './model';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';

export default class ActivityRepository extends DefaultRepository<Activity> implements BaseRepository<IActivity, ICreateActivity> {
    _model;

    constructor(model: typeof Activity) {
        super();
        this._model = model;
    }
}
