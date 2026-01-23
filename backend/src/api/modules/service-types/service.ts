import { Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils/index.js';
import { IServiceType } from './types.js';
import { IServiceTypeRequestBody } from './validations.js';
import ServiceTypeRepository from './repository.js';

export interface IServiceTypeService {
    createServiceType(body: IServiceTypeRequestBody, options?: { t: Transaction }): Promise<IServiceType>;
    getServiceTypes(query: Record<string, unknown>, options?: { t: Transaction }): Promise<IServiceType[]>;
    updateServiceType(
        query: Partial<IServiceTypeRequestBody> & { id: string },
        body: Partial<IServiceTypeRequestBody>,
        options?: { t: Transaction },
    ): Promise<IDataValues<IServiceType>>;
    findServiceTypeById(id: string, options?: { t: Transaction }): Promise<IServiceType | null>;
}

export default class ServiceTypeService implements IServiceTypeService {
    _repo: ServiceTypeRepository;

    constructor(repo: ServiceTypeRepository) {
        this._repo = repo;
    }

    convertToJson(data: IDataValues<IServiceType>) {
        if (!data) return null;
        return {
            ...data?.dataValues,
        };
    }

    async createServiceType(body: IServiceTypeRequestBody, options?: { t: Transaction }) {
        const serviceType = await this._repo.create(body, options);
        return this.convertToJson(serviceType as IDataValues<IServiceType>)!;
    }

    async getServiceTypes(query: Record<string, unknown>, options?: { t: Transaction }) {
        const serviceTypes = await this._repo.find(query, options);
        return serviceTypes.map((st) => this.convertToJson(st as unknown as IDataValues<IServiceType>)!);
    }

    async updateServiceType(
        query: Partial<IServiceTypeRequestBody> & { id: string },
        body: Partial<IServiceTypeRequestBody>,
        options?: { t: Transaction },
    ) {
        const serviceType = await this._repo.update(query, body, options);
        return serviceType as IDataValues<IServiceType>;
    }

    async findServiceTypeById(id: string, options?: { t: Transaction }) {
        const serviceType = await this._repo.findById(id, options);
        return this.convertToJson(serviceType as unknown as IDataValues<IServiceType>);
    }
}
