import { ICreateUser, IUser } from './types';
import User from './model';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';

export default class UserRepository extends DefaultRepository<User> implements BaseRepository<IUser, ICreateUser> {
  _model;

  constructor(model: typeof User) {
    super();
    this._model = model;
  }
}
