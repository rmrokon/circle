import { z } from "zod";
export const UserBodyValidationSchema = z.object({
  email: z.string({ message: 'Email is required!' }).min(1, 'Email is required!'),
});

