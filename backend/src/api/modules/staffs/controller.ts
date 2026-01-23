import { SuccessResponses } from '../../../utils/responses';
import { IStaffRequestBody } from './validations';
import { IStaffService } from './service';
import { Request, Response } from 'express';

export default class StaffController {
    _service: IStaffService;

    constructor(service: IStaffService) {
        this._service = service;
    }

    createStaff = async (req: Request, res: Response) => {
        const staff = await this._service.createStaff(req.body);
        return SuccessResponses(req, res, staff, { statusCode: 201 });
    };

    getStaffs = async (req: Request, res: Response) => {
        const staffs = await this._service.getStaffs(req.query);
        return SuccessResponses(req, res, staffs, { statusCode: 200 });
    };

    updateStaff = async (req: Request, res: Response) => {
        const { staffId } = req.params;
        const staff = await this._service.updateStaff({ id: staffId }, req.body);
        return SuccessResponses(req, res, staff, { statusCode: 200 });
    };

    getStaffById = async (req: Request, res: Response) => {
        const { staffId } = req.params;
        const staff = await this._service.findStaffById(staffId);
        return SuccessResponses(req, res, staff, { statusCode: 200 });
    };
}
