import { z } from 'zod';

export const ServiceTypeBodyValidationSchema = z.object({
    name: z.string({ message: 'Name is required!' }).min(1, 'Name is required!'),
});

export type IServiceTypeRequestBody = z.infer<typeof ServiceTypeBodyValidationSchema>;
