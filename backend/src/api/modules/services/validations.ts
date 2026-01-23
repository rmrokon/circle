import { z } from 'zod';

export const ServiceBodyValidationSchema = z.object({
    name: z.string({ required_error: 'Name is required!' }).min(1, 'Name is required!'),
    duration: z.number({ required_error: 'Duration is required!' }).min(1, 'Duration must be greater than 0'),
    serviceTypeId: z.string({ required_error: 'Service Type ID is required!' }).uuid('Invalid Service Type ID'),
});

export type IServiceRequestBody = z.infer<typeof ServiceBodyValidationSchema>;
