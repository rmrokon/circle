import { Request, Response } from 'express';
import { SuccessResponses } from '../../../utils/responses';
import { ICredentialRequestBody, ILoginCredentialRequestBody } from './types';
import { ICredentialService } from './service';

export default class CredentialController {
  _service: ICredentialService;

  constructor(service: ICredentialService) {
    this._service = service;
  }

  createCredential = async (req: Request, res: Response) => {
    const body = req.body as ICredentialRequestBody;
    const credential = await this._service.createCredential(body);
    return SuccessResponses(req, res, credential, {
      statusCode: 200,
    });
  };

  loginCredential = async (req: Request, res: Response) => {
    const body = req.body as ILoginCredentialRequestBody;
    console.log({ body });
    // return { success: true };
    const result = await this._service.verifyCredential(body);
    return SuccessResponses(req, res, result, {
      statusCode: 200,
    });
  };

  refreshCredential = async (req: Request, res: Response) => {
    const body = req.body as Pick<ILoginCredentialRequestBody, 'email'>;
    body.email = req.auth?.user.email;
    let result = null;
    if (req.auth) {
      result = await this._service.refreshCredential({ ...body });
    }
    return SuccessResponses(req, res, result, {
      statusCode: 200,
    });
  };

  logout = async (req: Request, res: Response) => {
    return SuccessResponses(
      req,
      res,
      {},
      {
        statusCode: 200,
      },
    );
  };

  getMe = async (req: Request, res: Response) => {
    const result = await this._service.getMe(req?.auth?.user.id);
    return SuccessResponses(req, res, result, {
      statusCode: 200,
    });
  };

  createAdminCredential = async (req: Request, res: Response) => {
    const body = req.body as ICredentialRequestBody;
    const credential = await this._service.createCredential({...body, isAdmin: true});
    return SuccessResponses(req, res, credential, {
      statusCode: 200,
    });
  };
}
