import { ICreateServiceType, IServiceType } from './types';
import ServiceType from './model';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';

export default class ServiceTypeRepository extends DefaultRepository<ServiceType> implements BaseRepository<IServiceType, ICreateServiceType> {
    _model;

    constructor(model: typeof ServiceType) {
        super();
        this._model = model;
    }
}
