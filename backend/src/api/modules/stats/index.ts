import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated } from '../../middlewares';
import { SuccessResponses } from '../../../utils/responses';
import { appointmentService, staffService } from '../bootstrap';
import { Op } from '@sequelize/core';

export const StatsRouter = Router();

StatsRouter.get('/dashboard', isAuthenticated, asyncCatchHandler(async (req, res) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const startOfDay = `${todayStr}T00:00:00`;
    const endOfDay = `${todayStr}T23:59:59`;

    // Fetch all appointments for today to calculate stats
    const appointmentsToday = await (appointmentService as any)._repo._model.findAll({
        where: {
            appointmentDateTime: {
                [Op.between]: [startOfDay, endOfDay],
            }
        }
    });

    const waitingQueue = await (appointmentService as any)._repo._model.findAll({
        where: {
            staffId: null,
            status: 'Scheduled'
        }
    });

    const totalToday = appointmentsToday.length;
    const completedToday = appointmentsToday.filter((a: any) => a.status === 'Completed').length;
    const pendingToday = appointmentsToday.filter((a: any) => a.status === 'Scheduled').length;
    const waitingQueueCount = waitingQueue.length;

    // Staff Load Summary
    const staffs = await staffService.getStaffs({});
    const staffLoad = await Promise.all(staffs.map(async (s) => {
        const appointments = await staffService.findStaffAppointmentsOnDate({ id: s.id, date: todayStr });
        return {
            name: s.name,
            current: appointments.appointments.length,
            limit: s.dailyCapacity,
            status: appointments.appointments.length >= s.dailyCapacity ? 'Booked' : 'OK'
        };
    }));

    return SuccessResponses(req, res, {
        totalToday,
        completedToday,
        pendingToday,
        waitingQueueCount,
        staffLoad
    }, { statusCode: 200 });
}));
