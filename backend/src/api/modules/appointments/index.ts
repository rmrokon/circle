import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { appointmentController } from '../bootstrap';
import { AppointmentBodyValidationSchema } from './validations';

export const AppointmentRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Customer appointment scheduling
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Book a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - serviceId
 *               - staffId
 *               - appointmentDateTime
 *             properties:
 *               customerName:
 *                 type: string
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *               staffId:
 *                 type: string
 *                 format: uuid
 *               appointmentDateTime:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [Scheduled, Completed, Cancelled, No-Show]
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *   get:
 *     summary: Retrieve all appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments retrieved
 */
AppointmentRouter.route('/')
    .post([isAuthenticated, validateRequestBody(AppointmentBodyValidationSchema)], asyncCatchHandler(appointmentController.createAppointment))
    .get([isAuthenticated], asyncCatchHandler(appointmentController.getAppointments));

/**
 * @swagger
 * /appointments/{appointmentId}:
 *   get:
 *     summary: Get an appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment details retrieved
 *   patch:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *               staffId:
 *                 type: string
 *                 format: uuid
 *               appointmentDateTime:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [Scheduled, Completed, Cancelled, No-Show]
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 */
AppointmentRouter.route('/:appointmentId')
    .get([isAuthenticated], asyncCatchHandler(appointmentController.getAppointmentById))
    .patch([isAuthenticated], asyncCatchHandler(appointmentController.updateAppointment));
