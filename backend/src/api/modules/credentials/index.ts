import { Router } from 'express';
import { asyncCatchHandler, parseAuth, validateRequestBody } from '../../middlewares';
import { credentialController } from '../bootstrap';
import { CredentialBodyValidationSchema, LoginCredentialBodyValidationSchema } from './validations';

export const CredentialRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Credentials
 *   description: Authentication and credential management
 */

/**
 * @swagger
 * /credentials:
 *   post:
 *     summary: Create a new credential
 *     tags: [Credentials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Credential created successfully
 *       400:
 *         description: Bad request
 */
CredentialRouter.route('/').post(
  [validateRequestBody(CredentialBodyValidationSchema)],
  asyncCatchHandler(credentialController.createCredential),
);

/**
 * @swagger
 * /credentials/admins:
 *   post:
 *     summary: Create a new admin credential
 *     tags: [Credentials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin credential created successfully
 */
CredentialRouter.route('/admins').post(
  [validateRequestBody(CredentialBodyValidationSchema)],
  asyncCatchHandler(credentialController.createAdminCredential),
);

/**
 * @swagger
 * /credentials/login:
 *   post:
 *     summary: Login and receive auth tokens
 *     tags: [Credentials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
CredentialRouter.route('/login').post(
  [validateRequestBody(LoginCredentialBodyValidationSchema)],
  asyncCatchHandler(credentialController.loginCredential),
);

/**
 * @swagger
 * /credentials/me:
 *   get:
 *     summary: Get current authenticated user's credentials
 *     tags: [Credentials]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User credentials retrieved
 *       401:
 *         description: Unauthorized
 */
CredentialRouter.route('/me').get([parseAuth], asyncCatchHandler(credentialController.getMe));
