/* eslint-disable @typescript-eslint/ban-ts-comment */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequest, IDataValues } from '../../../utils';
import { BaseRepository } from '../baseRepo';
import { userService } from '../bootstrap';
import { ICredential, ICredentialRequestBody, ICredentialTokenPayload, ILoginCredentialRequestBody } from './types';
import { sequelize } from '../../../loaders/datasource';
import { Transaction } from '@sequelize/core';
import { IUser, UserType } from '../users/types';
import generateStrongPassword from '../../../utils/generateStrongPassword';
import CredentialRepository from './repository';
// import emailService from '../../../srvs/email-srv';

export interface ICredentialService {
  createCredential(args: ICredentialRequestBody & { isAdmin?: boolean }): Promise<IUser>;
  verifyCredential(args: ILoginCredentialRequestBody): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }>;
  refreshCredential(args: Pick<ILoginCredentialRequestBody, 'email'>): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }>;
  getMe(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }>;
  getCredentialByUser(query: Record<string, unknown>): Promise<ICredential | null>;
}

export default class CredentialService implements ICredentialService {
  _repo: CredentialRepository;

  constructor(repo: CredentialRepository) {
    this._repo = repo;
  }

  convertToJson(data: IDataValues<ICredential>) {
    if (!data) return null;
    return {
      ...data?.dataValues,
    };
  }

  async hashPassword(pass: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pass, salt);
  }

  async verifyPassword(pass: string, hash: string) {
    return bcrypt.compare(pass, hash);
  }

  async createTokens(args: { payload: ICredentialTokenPayload; secret: string }) {
    const accessToken = jwt.sign(
      { user: args.payload.user },
      process.env.JWT_SECRET! + args.secret,
    );
    const refreshToken = jwt.sign(
      { user: args.payload.user },
      process.env.JWT_SECRET! + args.secret,
    );
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string, secret: string) {
    return jwt.verify(token, process.env.JWT_SECRET! + secret);
  }

  async createCredential(body: (ICredentialRequestBody) & { isAdmin?: boolean }) {
    const t = await sequelize.startUnmanagedTransaction();
    try {
      let user: IUser | null
      user = await userService.findUserByRaw({ email: body.email }, { t });
      if (user) throw new BadRequest('User taken');
      const strongPass = body.password;
      if (!user) {
        user = await userService.createUserRaw(
          {
            email: body.email ?? '',
            type: body.isAdmin ? UserType.Admin : UserType.General,
          },
          { t },
        );
      }
      if (!user) throw new BadRequest('Error while creating user!');
      const hashPassword = await this.hashPassword(strongPass);
      await this._repo.create(
        {
          password: hashPassword,
          userId: user.id,
        },
        { t },
      );
      await t.commit();
      return user;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async verifyCredential(args: ILoginCredentialRequestBody) {
    const t = await sequelize.startUnmanagedTransaction();
    try {
      const user = await userService.findUserByRaw({ email: args.email }, { t });
      if (!user) throw new BadRequest('User not found');
      const credential = await user.getCredential();
      if (!credential) throw new BadRequest('Invalid credentials');
      const isPasswordValid = await this.verifyPassword(args.password, credential.dataValues.password);
      if (!isPasswordValid) throw new BadRequest('Invalid credentials');

      const tokens = await this.createTokens({
        payload: {
          user: user,
        },
        secret: credential.dataValues.password,
      });
      const response = { ...tokens, user };
      await t.commit();
      return response;
    } catch (err) {
      await t.rollback();
      return Promise.reject(err);
    }
  }

  async refreshCredential(args: Pick<ILoginCredentialRequestBody, 'email'>) {
    const t = await sequelize.startUnmanagedTransaction();
    try {
      const user = await userService.findUserByRaw({ email: args.email }, { t });
      if (!user) throw new BadRequest('User not found');
      const credential = await user.getCredential({ transaction: t });
      if (!credential) throw new BadRequest('Invalid credentials');
      await t.commit();
      const tokens = await this.createTokens({
        payload: {
          user: user,
        },
        secret: credential.dataValues.password,
      });
      return { ...tokens, user };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async getMe(userId: string) {
    const user = await userService.findUserByRaw({ id: userId });
    if (!user) throw new BadRequest('User not found');
    const credential = await user.getCredential();
    if (!credential) throw new BadRequest('Invalid credentials');
    const tokens = await this.createTokens({
      payload: {
        user: user?.dataValues,
      },
      secret: credential.dataValues.password,
    });
    return { ...tokens, user: user?.dataValues };
  }

  async getCredentialByUser(query: Record<string, unknown>) {
    const res = await this._repo.findOne(query);
    return res;
  }
}
