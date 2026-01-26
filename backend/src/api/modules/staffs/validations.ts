import { z } from 'zod';
import { StaffAvailablityStatus } from './types';

export const StaffBodyValidationSchema = z.object({
    name: z.string({ message: 'Name is required!' }).min(1, 'Name is required!'),
    dailyCapacity: z.number().optional().default(5),
    available: z.enum([StaffAvailablityStatus.available, StaffAvailablityStatus.onLeave]).optional().default(StaffAvailablityStatus.available),
    serviceTypeId: z.string({ message: 'Service type is required!' }),
});

export type IStaffRequestBody = z.infer<typeof StaffBodyValidationSchema>;
