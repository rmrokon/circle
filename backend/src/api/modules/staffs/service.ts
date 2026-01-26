import { Op, Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils/index';
import { IStaff } from './types';
import { IStaffRequestBody } from './validations';
import StaffRepository from './repository';
import Appointment from '../appointments/model';

export interface IStaffService {
    createStaff(body: IStaffRequestBody, options?: { t: Transaction }): Promise<IStaff>;
    getStaffs(query: Record<string, unknown>, options?: { t: Transaction }): Promise<IStaff[]>;
    getStaffsWithAppointments(query: Record<string, unknown>, options?: { t: Transaction }): Promise<IStaff[]>;
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
        const { service_type_id, ...rest } = body;
        const staff = await this._repo.create(rest, options);
        if (service_type_id) {
            await (staff as any).setServiceTypes([service_type_id]);
        }
        const json = this.convertToJson(staff as IDataValues<IStaff>)! as any;
        json.serviceTypeId = service_type_id;
        return json;
    }

    async getStaffs(query: Record<string, unknown>, options?: { t: Transaction }) {
        const staffs = await this._repo.findAll(query as any, options);
        return staffs.map((staff: any) => {
            const json = this.convertToJson(staff as unknown as IDataValues<IStaff>)! as any;
            const serviceTypes = staff.serviceTypes || staff.dataValues?.serviceTypes || [];
            if (serviceTypes.length > 0) {
                json.serviceTypeId = serviceTypes[0].id;
                json.service_type_id = serviceTypes[0].id;
            }
            return json;
        });
    }

    async getStaffsWithAppointments(query: Record<string, unknown>, options?: { t: Transaction }) {
        const staffs = await this._repo.findAll({
            ...query,
        } as any, options);
        return staffs;
    }

    async updateStaff(
        query: Partial<IStaffRequestBody> & { id: string },
        body: Partial<IStaffRequestBody>,
        options?: { t: Transaction },
    ) {
        const { service_type_id, ...rest } = body as any;
        const staff = await this._repo.update(query, rest, options);
        if (service_type_id) {
            await (staff as any).setServiceTypes([service_type_id]);
        }
        const json = this.convertToJson(staff as any)! as any;
        json.serviceTypeId = service_type_id;
        return json;
    }

    async findStaffById(id: string, options?: { t: Transaction }) {
        const staff = await this._repo.findById(id, options);
        return this.convertToJson(staff as unknown as IDataValues<IStaff>);
    }

    async findStaffAppointmentsForToday({ id, date }: { id: string, date: string }, options?: { t: Transaction }) {
        const staff = await this._repo.findById(id, options);
        if (!staff) throw new Error('Staff not found!');
        const appointments = await staff.getAppointments({
            where: {
                appointmentDateTime: {
                    [Op.gte]: date,
                    [Op.lt]: date,
                },
            },
        });
        const staffJson = this.convertToJson(staff as unknown as IDataValues<IStaff>)!;
        return {
            ...staffJson,
            appointments,
        };
    }
}
