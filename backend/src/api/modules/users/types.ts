import { z } from 'zod';
import type {
  UserBodyValidationSchema,
} from './validations';
import { Attributes, CreationAttributes } from '@sequelize/core';
import User from './model';

export interface IUser extends Attributes<User>{};
export type ICreateUser = CreationAttributes<User>;
export enum UserType {
  Admin = 'ADMIN',
  General = 'GENERAL',
};
export type IUserRequestBody = z.infer<typeof UserBodyValidationSchema>;


