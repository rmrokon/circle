import { z } from 'zod';
import { AppointmentStatus } from './types';

export const AppointmentBodyValidationSchema = z.object({
    customerName: z.string({ message: 'Customer name is required!' }).min(1, 'Customer name is required!'),
    serviceId: z.string({ message: 'Service ID is required!' }).uuid('Invalid Service ID'),
    staffId: z.string({ message: 'Staff ID is required!' }).uuid('Invalid Staff ID'),
    appointmentDateTime: z.string({ message: 'Appointment date and time is required!' }).refine((val: string) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }),
    status: z.enum([
        AppointmentStatus.Scheduled,
        AppointmentStatus.Completed,
        AppointmentStatus.Cancelled,
        AppointmentStatus['No-Show']
    ]).optional().default(AppointmentStatus.Scheduled),
});

export type IAppointmentRequestBody = z.infer<typeof AppointmentBodyValidationSchema>;
