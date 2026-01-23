import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { serviceTypeController } from '../bootstrap';
import { ServiceTypeBodyValidationSchema } from './validations';

export const ServiceTypeRouter = Router();

/**
 * @swagger
 * tags:
 *   name: ServiceTypes
 *   description: Categories of services
 */

/**
 * @swagger
 * /service-types:
 *   post:
 *     summary: Create a new service type
 *     tags: [ServiceTypes]
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service type created successfully
 *   get:
 *     summary: Retrieve all service types
 *     tags: [ServiceTypes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of service types retrieved
 */
ServiceTypeRouter.route('/')
    .post([isAuthenticated, validateRequestBody(ServiceTypeBodyValidationSchema)], asyncCatchHandler(serviceTypeController.createServiceType))
    .get([isAuthenticated], asyncCatchHandler(serviceTypeController.getServiceTypes));

/**
 * @swagger
 * /service-types/{serviceTypeId}:
 *   get:
 *     summary: Get a service type by ID
 *     tags: [ServiceTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceTypeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service type details retrieved
 *   patch:
 *     summary: Update a service type
 *     tags: [ServiceTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceTypeId
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
 *     responses:
 *       200:
 *         description: Service type updated successfully
 */
ServiceTypeRouter.route('/:serviceTypeId')
    .get([isAuthenticated], asyncCatchHandler(serviceTypeController.getServiceTypeById))
    .patch([isAuthenticated], asyncCatchHandler(serviceTypeController.updateServiceType));
