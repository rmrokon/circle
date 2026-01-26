import { SuccessResponses } from '../../../utils/responses';
import { IAppointmentRequestBody } from './validations';
import { IAppointmentService } from './service';
import { Request, Response } from 'express';

export default class AppointmentController {
    _service: IAppointmentService;

    constructor(service: IAppointmentService) {
        this._service = service;
    }

    createAppointment = async (req: Request, res: Response) => {
        const appointment = await this._service.createAppointment(req.body);
        return SuccessResponses(req, res, appointment, { statusCode: 201 });
    };

    getAppointments = async (req: Request, res: Response) => {
        const appointments = await this._service.getAppointments(req.query);
        return SuccessResponses(req, res, appointments, { statusCode: 200 });
    };

    updateAppointment = async (req: Request, res: Response) => {
        const { appointmentId } = req.params;
        const previousAppointment = await this._service.findAppointmentById(appointmentId);
        const appointment = await this._service.updateAppointment({ id: appointmentId }, req.body);

        // Trigger auto-assignment if an appointment was cancelled
        // This frees up the staff member to take items from the queue
        if (req.body.status === 'Cancelled' && previousAppointment?.status !== 'Cancelled' && previousAppointment?.staffId) {
            await this._service.assignQueueToStaff(previousAppointment.staffId);
        }

        return SuccessResponses(req, res, appointment, { statusCode: 200 });
    };

    getAppointmentById = async (req: Request, res: Response) => {
        const { appointmentId } = req.params;
        const appointment = await this._service.findAppointmentById(appointmentId);
        return SuccessResponses(req, res, appointment, { statusCode: 200 });
    };
}
