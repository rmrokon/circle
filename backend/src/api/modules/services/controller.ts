import { SuccessResponses } from '../../../utils/responses';
import { IServiceRequestBody } from './validations';
import { IServiceService } from './service';
import { Request, Response } from 'express';

export default class ServiceController {
    _service: IServiceService;

    constructor(service: IServiceService) {
        this._service = service;
    }

    createService = async (req: Request, res: Response) => {
        const service = await this._service.createService(req.body);
        return SuccessResponses(req, res, service, { statusCode: 201 });
    };

    getServices = async (req: Request, res: Response) => {
        const services = await this._service.getServices(req.query);
        return SuccessResponses(req, res, services, { statusCode: 200 });
    };

    updateService = async (req: Request, res: Response) => {
        const { serviceId } = req.params;
        const service = await this._service.updateService({ id: serviceId }, req.body);
        return SuccessResponses(req, res, service, { statusCode: 200 });
    };

    getServiceById = async (req: Request, res: Response) => {
        const { serviceId } = req.params;
        const service = await this._service.findServiceById(serviceId);
        return SuccessResponses(req, res, service, { statusCode: 200 });
    };
}
