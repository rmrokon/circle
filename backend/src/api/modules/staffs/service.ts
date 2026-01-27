import { Op, Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils/index';
import { IStaff } from './types';
import { IStaffRequestBody } from './validations';
import StaffRepository from './repository';
import Appointment from '../appointments/model';
import { activityService } from '../bootstrap';
import { ActivityType } from '../activities/types';

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
        const { serviceTypeId, ...rest } = body;
        const staff = await this._repo.create(rest, options);
        if (serviceTypeId) {
            await (staff as any).setServiceTypes([serviceTypeId]);
        }
        const json = this.convertToJson(staff as IDataValues<IStaff>)! as any;
        json.serviceTypeId = serviceTypeId;

        await activityService.logActivity({
            type: ActivityType.STAFF_CREATED,
            message: `New staff member ${json.name} added`,
            metadata: { staffId: json.id }
        }, options);

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

        if (body.available) {
            await activityService.logActivity({
                type: ActivityType.STAFF_AVAILABILITY_CHANGED,
                message: `Staff ${json.name} is now ${body.available}`,
                metadata: { staffId: query.id, status: body.available }
            }, options);
        }

        return json;
    }

    async findStaffById(id: string, options?: { t: Transaction }) {
        const staffs = await this._repo.findAll({ id: id as any }, options);
        if (staffs.length === 0) return null;
        const staff: any = staffs[0];
        const json = this.convertToJson(staff as unknown as IDataValues<IStaff>)! as any;
        const serviceTypes = staff.serviceTypes || staff.dataValues?.serviceTypes || [];
        if (serviceTypes.length > 0) {
            json.serviceTypeId = serviceTypes[0].id;
        }
        return json;
    }

    async findStaffAppointmentsOnDate({ id, date }: { id: string, date: string }, options?: { t: Transaction }) {
        const staff = await this._repo.findById(id, options);
        if (!staff) throw new Error('Staff not found!');

        const startOfDay = `${date.slice(0, 10)}T00:00:00`;
        const endOfDay = `${date.slice(0, 10)}T23:59:59`;

        const appointments = await staff.getAppointments({
            where: {
                appointmentDateTime: {
                    [Op.between]: [startOfDay, endOfDay],
                },
                status: {
                    [Op.eq]: 'Scheduled',
                }
            },
        });
        const staffJson = this.convertToJson(staff as unknown as IDataValues<IStaff>)!;
        return {
            ...staffJson,
            appointments,
        };
    }
}
