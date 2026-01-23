import { Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils/index.js';
import { IService } from './types.js';
import { IServiceRequestBody } from './validations.js';
import ServiceRepository from './repository.js';

export interface IServiceService {
    createService(body: IServiceRequestBody, options?: { t: Transaction }): Promise<IService>;
    getServices(query: Record<string, unknown>, options?: { t: Transaction }): Promise<IService[]>;
    updateService(
        query: Partial<IServiceRequestBody> & { id: string },
        body: Partial<IServiceRequestBody>,
        options?: { t: Transaction },
    ): Promise<IDataValues<IService>>;
    findServiceById(id: string, options?: { t: Transaction }): Promise<IService | null>;
}

export default class ServiceService implements IServiceService {
    _repo: ServiceRepository;

    constructor(repo: ServiceRepository) {
        this._repo = repo;
    }

    convertToJson(data: IDataValues<IService>) {
        if (!data) return null;
        return {
            ...data?.dataValues,
        };
    }

    async createService(body: IServiceRequestBody, options?: { t: Transaction }) {
        const service = await this._repo.create(body, options);
        return this.convertToJson(service as IDataValues<IService>)!;
    }

    async getServices(query: Record<string, unknown>, options?: { t: Transaction }) {
        const services = await this._repo.find(query, options);
        return services.map((s) => this.convertToJson(s as unknown as IDataValues<IService>)!);
    }

    async updateService(
        query: Partial<IServiceRequestBody> & { id: string },
        body: Partial<IServiceRequestBody>,
        options?: { t: Transaction },
    ) {
        const service = await this._repo.update(query, body, options);
        return service as IDataValues<IService>;
    }

    async findServiceById(id: string, options?: { t: Transaction }) {
        const service = await this._repo.findById(id, options);
        return this.convertToJson(service as unknown as IDataValues<IService>);
    }
}
