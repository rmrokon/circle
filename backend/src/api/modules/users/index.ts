import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { userController } from '../bootstrap';
import { UserBodyValidationSchema } from './validations';

export const UserRouter = Router();

UserRouter.route('/')
  .post([validateRequestBody(UserBodyValidationSchema)], asyncCatchHandler(userController.createUser))
  .get([], asyncCatchHandler(userController.getUsers));

UserRouter.route('/').get([], asyncCatchHandler(userController.getUsers));

UserRouter.route('/:userId').patch([isAuthenticated], asyncCatchHandler(userController.updateUser));

UserRouter.route('/:userId/goals/:purposeId').post([isAuthenticated], asyncCatchHandler(userController.setUserGoal));

