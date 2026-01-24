import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { staffController } from '../bootstrap';
import { StaffBodyValidationSchema } from './validations';

export const StaffRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Staffs
 *   description: Staff management and availability
 */

/**
 * @swagger
 * /staffs:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staffs]
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
 *               daily_capacity:
 *                 type: number
 *               available:
 *                 type: string
 *                 enum: [available, onLeave]
 *               service_type_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Staff created successfully
 *   get:
 *     summary: Retrieve a list of staff members
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of staff members retrieved
 */
StaffRouter.route('/')
    .post([isAuthenticated, validateRequestBody(StaffBodyValidationSchema)], asyncCatchHandler(staffController.createStaff))
    .get([isAuthenticated], asyncCatchHandler(staffController.getStaffs));

/**
 * @swagger
 * /staffs/{staffId}:
 *   get:
 *     summary: Get a staff member by ID
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff details retrieved
 *   patch:
 *     summary: Update a staff member
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: staffId
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
 *               daily_capacity:
 *                 type: number
 *               available:
 *                 type: string
 *                 enum: [available, onLeave]
 *     responses:
 *       200:
 *         description: Staff updated successfully
 */
StaffRouter.route('/:staffId')
    .get([isAuthenticated], asyncCatchHandler(staffController.getStaffById))
    .patch([isAuthenticated], asyncCatchHandler(staffController.updateStaff));
