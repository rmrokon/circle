import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { serviceTypeController } from '../bootstrap';
import { ServiceTypeBodyValidationSchema } from './validations';

export const ServiceTypeRouter = Router();

ServiceTypeRouter.route('/')
    .post([isAuthenticated, validateRequestBody(ServiceTypeBodyValidationSchema)], asyncCatchHandler(serviceTypeController.createServiceType))
    .get([isAuthenticated], asyncCatchHandler(serviceTypeController.getServiceTypes));

ServiceTypeRouter.route('/:serviceTypeId')
    .get([isAuthenticated], asyncCatchHandler(serviceTypeController.getServiceTypeById))
    .patch([isAuthenticated], asyncCatchHandler(serviceTypeController.updateServiceType));
