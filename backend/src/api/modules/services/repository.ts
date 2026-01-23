import { ICreateService, IService } from './types';
import Service from './model';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';

export default class ServiceRepository extends DefaultRepository<Service> implements BaseRepository<IService, ICreateService> {
    _model;

    constructor(model: typeof Service) {
        super();
        this._model = model;
    }
}
