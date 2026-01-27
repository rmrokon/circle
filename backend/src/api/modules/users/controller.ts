import { Request, Response } from 'express';
import { SuccessResponses } from '../../../utils/responses';
import { IUserRequestBody } from './types';
import { IUserService } from './service';

export default class UserController {
  _service: IUserService;

  constructor(service: IUserService) {
    this._service = service;
  }

  createUser = async (req: Request, res: Response) => {
    const body = req.body as IUserRequestBody;
    const user = await this._service.createUser(body);
    return SuccessResponses(req, res, user, {
      statusCode: 200,
    });
  };

  getUsers = async (req: Request, res: Response) => {
    const users = await this._service.find(req.query);
    return SuccessResponses(req, res, users, {
      statusCode: 200,
    });
  };

  updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params as { userId: string };
    // @ts-ignore
    const result = await this._service.updateUser({ id: userId }, req.body);
    return SuccessResponses(req, res, result, {
      statusCode: 200,
    });
  };
}
