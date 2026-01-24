import { z } from 'zod';
import { StaffAvailablityStatus } from './types';

export const StaffBodyValidationSchema = z.object({
    name: z.string({ message: 'Name is required!' }).min(1, 'Name is required!'),
    daily_capacity: z.number().optional().default(5),
    available: z.enum(StaffAvailablityStatus).optional().default(StaffAvailablityStatus.available),
    service_type_id: z.string({ message: 'Service type is required!' }),
});

export type IStaffRequestBody = z.infer<typeof StaffBodyValidationSchema>;
