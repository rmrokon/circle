import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { appointmentController } from '../bootstrap';
import { AppointmentBodyValidationSchema } from './validations';

export const AppointmentRouter = Router();

AppointmentRouter.route('/')
    .post([isAuthenticated, validateRequestBody(AppointmentBodyValidationSchema)], asyncCatchHandler(appointmentController.createAppointment))
    .get([isAuthenticated], asyncCatchHandler(appointmentController.getAppointments));

AppointmentRouter.route('/:appointmentId')
    .get([isAuthenticated], asyncCatchHandler(appointmentController.getAppointmentById))
    .patch([isAuthenticated], asyncCatchHandler(appointmentController.updateAppointment));
