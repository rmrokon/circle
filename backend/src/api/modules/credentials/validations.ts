import { z } from 'zod';
import { UserBodyValidationSchema } from '../users/validations';

export const CredentialBodyValidationSchema = UserBodyValidationSchema.merge(
  z.object({
    password: z
      .string({ message: 'Password is required!' })
      .min(8, 'Password needs to be more then 8 characters long'),
  }),
);

export const LoginCredentialBodyValidationSchema = z.object({
  password: z.string({ message: 'Password is required!' }).min(1, 'Password is required!'),
  email: z.string({ message: 'Email is required!' }).min(1, 'Email is required!').email(),
});
