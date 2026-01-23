import { Router } from 'express';
import { asyncCatchHandler, parseAuth, validateRequestBody } from '../../middlewares';
import { credentialController } from '../bootstrap';
import { CredentialBodyValidationSchema, LoginCredentialBodyValidationSchema } from './validations';

export const CredentialRouter = Router();

CredentialRouter.route('/').post(
  [validateRequestBody(CredentialBodyValidationSchema)],
  asyncCatchHandler(credentialController.createCredential),
);

CredentialRouter.route('/admins').post(
  [validateRequestBody(CredentialBodyValidationSchema)],
  asyncCatchHandler(credentialController.createAdminCredential),
);

CredentialRouter.route('/login').post(
  [validateRequestBody(LoginCredentialBodyValidationSchema)],
  asyncCatchHandler(credentialController.loginCredential),
);

CredentialRouter.route('/me').get([parseAuth], asyncCatchHandler(credentialController.getMe));
