import { SuccessResponses } from '../../../utils/responses';
import { IStaffRequestBody } from './validations';
import { IStaffService } from './service';
import { Request, Response } from 'express';
import { appointmentService } from '../bootstrap';

export default class StaffController {
    _service: IStaffService;

    constructor(service: IStaffService) {
        this._service = service;
    }

    createStaff = async (req: Request, res: Response) => {
        const staff = await this._service.createStaff(req.body);
        // Trigger auto-assignment for new staff
        await appointmentService.assignQueueToStaff(staff.id);

        return SuccessResponses(req, res, staff, { statusCode: 201 });
    };

    getStaffs = async (req: Request, res: Response) => {
        const staffs = await this._service.getStaffsWithAppointments(req.query);
        return SuccessResponses(req, res, staffs, { statusCode: 200 });
    };

    updateStaff = async (req: Request, res: Response) => {
        const { staffId } = req.params;
        const previousStaff = await this._service.findStaffById(staffId);
        const staff = await this._service.updateStaff({ id: staffId }, req.body);

        // Trigger if:
        // 1. Available was not 'available' and now it is
        // 2. Daily capacity increased
        const statusChangedToAvailable = previousStaff?.available !== 'available' && req.body.available === 'available';
        const capacityIncreased = req.body.dailyCapacity > (previousStaff?.dailyCapacity || 0);

        if (statusChangedToAvailable || capacityIncreased) {
            await appointmentService.assignQueueToStaff(staffId);
        }

        return SuccessResponses(req, res, staff, { statusCode: 200 });
    };

    getStaffById = async (req: Request, res: Response) => {
        const { staffId } = req.params;
        const staff = await this._service.findStaffById(staffId);
        return SuccessResponses(req, res, staff, { statusCode: 200 });
    };
}
