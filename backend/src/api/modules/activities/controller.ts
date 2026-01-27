import { SuccessResponses } from '../../../utils/responses';
import { IActivityService } from './service';
import { Request, Response } from 'express';

export default class ActivityController {
    _service: IActivityService;

    constructor(service: IActivityService) {
        this._service = service;
    }

    getActivities = async (req: Request, res: Response) => {
        const activities = await this._service.getActivities(req.query);
        return SuccessResponses(req, res, activities, { statusCode: 200 });
    };

    getRecentActivities = async (req: Request, res: Response) => {
        const limit = parseInt(req.query.limit as string) || 10;
        const activities = await this._service.getRecentActivities(limit);
        return SuccessResponses(req, res, activities, { statusCode: 200 });
    };
}
