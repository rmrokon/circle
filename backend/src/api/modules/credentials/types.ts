import { z } from 'zod';
import { IUser } from '../users/types';
import { CredentialBodyValidationSchema, LoginCredentialBodyValidationSchema } from './validations';
import { CreationAttributes } from '@sequelize/core';
import Credential from './model';
// import { IAuthor } from '../authors/types';

export interface ICredential extends Credential { };
export type ICreateCredential = CreationAttributes<Credential>;

export type ICredentialRequestBody = z.infer<typeof CredentialBodyValidationSchema>;
export type ILoginCredentialRequestBody = z.infer<typeof LoginCredentialBodyValidationSchema>;
export type ICredentialTokenPayload = {
  user: IUser;
};
