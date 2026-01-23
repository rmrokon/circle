import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { serviceController } from '../bootstrap';
import { ServiceBodyValidationSchema } from './validations';

export const ServiceRouter = Router();

ServiceRouter.route('/')
    .post([isAuthenticated, validateRequestBody(ServiceBodyValidationSchema)], asyncCatchHandler(serviceController.createService))
    .get([isAuthenticated], asyncCatchHandler(serviceController.getServices));

ServiceRouter.route('/:serviceId')
    .get([isAuthenticated], asyncCatchHandler(serviceController.getServiceById))
    .patch([isAuthenticated], asyncCatchHandler(serviceController.updateService));
