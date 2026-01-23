import { z } from 'zod';
import { StaffAvailablityStatus } from './types';

export const StaffBodyValidationSchema = z.object({
    name: z.string({ required_error: 'Name is required!' }).min(1, 'Name is required!'),
    daily_capacity: z.number().optional().default(5),
    available: z.nativeEnum(StaffAvailablityStatus).optional().default(StaffAvailablityStatus.available),
});

export type IStaffRequestBody = z.infer<typeof StaffBodyValidationSchema>;
