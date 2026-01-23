import { SuccessResponses } from '../../../utils/responses';
import { IServiceTypeRequestBody } from './validations';
import { IServiceTypeService } from './service';
import { Request, Response } from 'express';

export default class ServiceTypeController {
    _service: IServiceTypeService;

    constructor(service: IServiceTypeService) {
        this._service = service;
    }

    createServiceType = async (req: Request, res: Response) => {
        const serviceType = await this._service.createServiceType(req.body);
        return SuccessResponses(req, res, serviceType, { statusCode: 201 });
    };

    getServiceTypes = async (req: Request, res: Response) => {
        const serviceTypes = await this._service.getServiceTypes(req.query);
        return SuccessResponses(req, res, serviceTypes, { statusCode: 200 });
    };

    updateServiceType = async (req: Request, res: Response) => {
        const { serviceTypeId } = req.params;
        const serviceType = await this._service.updateServiceType({ id: serviceTypeId }, req.body);
        return SuccessResponses(req, res, serviceType, { statusCode: 200 });
    };

    getServiceTypeById = async (req: Request, res: Response) => {
        const { serviceTypeId } = req.params;
        const serviceType = await this._service.findServiceTypeById(serviceTypeId);
        return SuccessResponses(req, res, serviceType, { statusCode: 200 });
    };
}
