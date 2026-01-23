import { Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils/index.js';
import { IStaff } from './types.js';
import { IStaffRequestBody } from './validations.js';
import StaffRepository from './repository.js';

export interface IStaffService {
    createStaff(body: IStaffRequestBody, options?: { t: Transaction }): Promise<IStaff>;
    getStaffs(query: Record<string, unknown>, options?: { t: Transaction }): Promise<IStaff[]>;
    updateStaff(
        query: Partial<IStaffRequestBody> & { id: string },
        body: Partial<IStaffRequestBody>,
        options?: { t: Transaction },
    ): Promise<IDataValues<IStaff>>;
    findStaffById(id: string, options?: { t: Transaction }): Promise<IStaff | null>;
}

export default class StaffService implements IStaffService {
    _repo: StaffRepository;

    constructor(repo: StaffRepository) {
        this._repo = repo;
    }

    convertToJson(data: IDataValues<IStaff>) {
        if (!data) return null;
        return {
            ...data?.dataValues,
        };
    }

    async createStaff(body: IStaffRequestBody, options?: { t: Transaction }) {
        const staff = await this._repo.create(body, options);
        return this.convertToJson(staff as IDataValues<IStaff>)!;
    }

    async getStaffs(query: Record<string, unknown>, options?: { t: Transaction }) {
        const staffs = await this._repo.find(query, options);
        return staffs.map((staff) => this.convertToJson(staff as unknown as IDataValues<IStaff>)!);
    }

    async updateStaff(
        query: Partial<IStaffRequestBody> & { id: string },
        body: Partial<IStaffRequestBody>,
        options?: { t: Transaction },
    ) {
        const staff = await this._repo.update(query, body, options);
        return staff as IDataValues<IStaff>;
    }

    async findStaffById(id: string, options?: { t: Transaction }) {
        const staff = await this._repo.findById(id, options);
        return this.convertToJson(staff as unknown as IDataValues<IStaff>);
    }
}
