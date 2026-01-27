import { Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils/index';
import { IActivity, ICreateActivity } from './types';
import ActivityRepository from './repository';

export interface IActivityService {
    logActivity(data: ICreateActivity, options?: { t: Transaction }): Promise<IActivity>;
    getActivities(query: Record<string, unknown>, options?: { t: Transaction }): Promise<IActivity[]>;
    getRecentActivities(limit: number): Promise<IActivity[]>;
}

export default class ActivityService implements IActivityService {
    _repo: ActivityRepository;

    constructor(repo: ActivityRepository) {
        this._repo = repo;
    }

    convertToJson(data: IDataValues<IActivity>) {
        if (!data) return null;
        return {
            ...data?.dataValues,
        };
    }

    async logActivity(data: ICreateActivity, options?: { t: Transaction }) {
        const activity = await this._repo.create(data, options);
        return this.convertToJson(activity as IDataValues<IActivity>)!;
    }

    async getActivities(query: Record<string, unknown>, options?: { t: Transaction }) {
        const activities = await this._repo.find(query, options);
        return activities.map((a) => this.convertToJson(a as unknown as IDataValues<IActivity>)!);
    }

    async getRecentActivities(limit: number = 10) {
        // Since DefaultRepository find doesn't support order/limit easily without raw options,
        // we'll access the model directly or update repo.
        const records = await (this._repo as any)._model.findAll({
            order: [['createdAt', 'DESC']],
            limit,
        });
        return records.map((a: any) => this.convertToJson(a as unknown as IDataValues<IActivity>)!);
    }
}
