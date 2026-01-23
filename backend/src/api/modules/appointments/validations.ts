import { z } from 'zod';
import { AppointmentStatus } from './types';

export const AppointmentBodyValidationSchema = z.object({
    customerName: z.string({ required_error: 'Customer name is required!' }).min(1, 'Customer name is required!'),
    serviceId: z.string({ required_error: 'Service ID is required!' }).uuid('Invalid Service ID'),
    staffId: z.string({ required_error: 'Staff ID is required!' }).uuid('Invalid Staff ID'),
    appointmentDateTime: z.string({ required_error: 'Appointment date and time is required!' }).refine((val: string) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }),
    status: z.nativeEnum(AppointmentStatus).optional().default(AppointmentStatus.Scheduled),
});

export type IAppointmentRequestBody = z.infer<typeof AppointmentBodyValidationSchema>;
