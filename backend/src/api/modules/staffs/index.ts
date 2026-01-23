import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { staffController } from '../bootstrap';
import { StaffBodyValidationSchema } from './validations';

export const StaffRouter = Router();

StaffRouter.route('/')
    .post([isAuthenticated, validateRequestBody(StaffBodyValidationSchema)], asyncCatchHandler(staffController.createStaff))
    .get([isAuthenticated], asyncCatchHandler(staffController.getStaffs));

StaffRouter.route('/:staffId')
    .get([isAuthenticated], asyncCatchHandler(staffController.getStaffById))
    .patch([isAuthenticated], asyncCatchHandler(staffController.updateStaff));
