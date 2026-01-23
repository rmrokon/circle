import { ICreateCredential, ICredential } from './types';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';
import Credential from './model';

export default class CredentialRepository extends DefaultRepository<Credential> implements BaseRepository<ICredential, ICreateCredential> {
  _model;

  constructor(model: typeof Credential) {
    super();
    this._model = model;
  }
}
