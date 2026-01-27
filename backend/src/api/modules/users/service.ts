/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils';
import { BaseRepository } from '../baseRepo';
import {
  IUser,
  IUserRequestBody,
  UserType,
} from './types';
import { sequelize } from '../../../loaders/datasource';
import User from './model';
import UserRepository from './repository';

export interface IUserService {
  createUser(args: IUserRequestBody): Promise<IUser>;
  updateUser(
    query: Partial<IUserRequestBody> & { id: string },
    body: Partial<IUserRequestBody>,
    options?: { t: Transaction },
  ): Promise<IDataValues<IUser>>;
  find(query: Record<string, unknown>, options?: { t: Transaction }): Promise<Partial<IUser>[]>;
}

export default class UserService implements IUserService {
  _repo: UserRepository;

  constructor(repo: UserRepository) {
    this._repo = repo;
  }

  convertToJson(data: IDataValues<IUser>) {
    if (!data) return null;
    return {
      ...data?.dataValues,
    };
  }

  async createUser(body: IUserRequestBody & { type: UserType }, options?: { t: Transaction }) {
    const user = await this._repo.create(body, options);
    return this.convertToJson(user as IDataValues<IUser>)!;
  }

  async find(query: Record<string, unknown>, options?: { t: Transaction }) {
    const users = await this._repo.find(query, options);
    return users;
  }

  async createUserRaw(body: IUserRequestBody & { type: UserType }, options?: { t: Transaction }) {
    const user = await this._repo.create(body, options);
    return user;
  }

  async updateUser(
    query: Partial<IUserRequestBody> & { id: string },
    body: Partial<IUserRequestBody>,
    options?: { t: Transaction },
  ) {
    console.log('here');

    const user = await this._repo.update(query, body, options);
    console.log({ user });

    return user as IDataValues<IUser>;
  }

  async findUserById(id: string, options?: { t: Transaction }) {
    const user = await this._repo.findById(id, options);
    return this.convertToJson(user as unknown as IDataValues<IUser>);
  }

  async findRawUserById(id: string, options?: { t: Transaction }) {
    const user = await this._repo.findOne({ id }, options);
    return user;
  }

  async findUserByRaw(query: Record<string, unknown>, options?: { t: Transaction }) {
    const user = await this._repo.findOne(query, options);
    return user;
  }

  async findUserBy(query: Record<string, unknown>, options?: { t: Transaction }) {
    const users = await this._repo.find(query, options);
    return users;
  }

  async findByIdRawQuery(id: string, options: { t: Transaction }) {
    const record = await sequelize.query('SELECT * FROM `users` where id = :id', {
      // @ts-ignore
      type: sequelize.QueryTypes.SELECT,
      replacements: { id },
      transaction: options.t,
      model: User,
    });
    return record;
  }
}
