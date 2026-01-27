import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated } from '../../middlewares';
import { activityController } from '../bootstrap';

export const ActivityRouter = Router();

ActivityRouter.route('/')
    .get([isAuthenticated], asyncCatchHandler(activityController.getActivities));

ActivityRouter.route('/recent')
    .get([isAuthenticated], asyncCatchHandler(activityController.getRecentActivities));
