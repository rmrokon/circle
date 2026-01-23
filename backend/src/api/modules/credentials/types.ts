import { z } from 'zod';
import { IUser } from '../users/types';
import { CredentialBodyValidationSchema, LoginCredentialBodyValidationSchema } from './validations';
import { IPurpose } from '../purposes/types';
import { CreationAttributes } from '@sequelize/core';
import Credential from './model';
// import { IAuthor } from '../authors/types';

export interface ICredential extends Credential {};
export type ICreateCredential = CreationAttributes<Credential>;

export type ICredentialRequestBody = z.infer<typeof CredentialBodyValidationSchema>;
export type ILoginCredentialRequestBody = z.infer<typeof LoginCredentialBodyValidationSchema>;
export type ICredentialTokenPayload = {
  // uid: string;
  // aid: string;
  // tid: string;
  // cid: string;
  user: IUser;
  selectedGoal?: IPurpose;
  // author?: IAuthor;
  // roles: { id: string; name: string }[];
  // permissions: { id: string; name: string }[];
};
