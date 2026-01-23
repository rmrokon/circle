import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { serviceController } from '../bootstrap';
import { ServiceBodyValidationSchema } from './validations';

export const ServiceRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Specific services offered
 */

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - duration
 *               - serviceTypeId
 *             properties:
 *               name:
 *                 type: string
 *               duration:
 *                 type: number
 *               serviceTypeId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Service created successfully
 *   get:
 *     summary: Retrieve all services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services retrieved
 */
ServiceRouter.route('/')
    .post([isAuthenticated, validateRequestBody(ServiceBodyValidationSchema)], asyncCatchHandler(serviceController.createService))
    .get([isAuthenticated], asyncCatchHandler(serviceController.getServices));

/**
 * @swagger
 * /services/{serviceId}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details retrieved
 *   patch:
 *     summary: Update a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
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
 *               name:
 *                 type: string
 *               duration:
 *                 type: number
 *               serviceTypeId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Service updated successfully
 */
ServiceRouter.route('/:serviceId')
    .get([isAuthenticated], asyncCatchHandler(serviceController.getServiceById))
    .patch([isAuthenticated], asyncCatchHandler(serviceController.updateService));
