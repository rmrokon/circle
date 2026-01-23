import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { userController } from '../bootstrap';
import { UserBodyValidationSchema } from './validations';

export const UserRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile operations
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved
 */
UserRouter.route('/')
  .post([validateRequestBody(UserBodyValidationSchema)], asyncCatchHandler(userController.createUser))
  .get([], asyncCatchHandler(userController.getUsers));

/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     summary: Update an existing user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *         description: User updated successfully
 */
UserRouter.route('/:userId').patch([isAuthenticated], asyncCatchHandler(userController.updateUser));

/**
 * @swagger
 * /users/{userId}/goals/{purposeId}:
 *   post:
 *     summary: Set a goal/purpose for a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *       - in: path
 *         name: purposeId
 *         required: true
 *     responses:
 *       200:
 *         description: Goal set successfully
 */
UserRouter.route('/:userId/goals/:purposeId').post([isAuthenticated], asyncCatchHandler(userController.setUserGoal));

