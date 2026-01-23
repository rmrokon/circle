import { z } from 'zod';

export const ServiceBodyValidationSchema = z.object({
    name: z.string({ message: 'Name is required!' }).min(1, 'Name is required!'),
    duration: z.number({ message: 'Duration is required!' }).min(1, 'Duration must be greater than 0'),
    serviceTypeId: z.string({ message: 'Service Type ID is required!' }).uuid('Invalid Service Type ID'),
});

export type IServiceRequestBody = z.infer<typeof ServiceBodyValidationSchema>;
