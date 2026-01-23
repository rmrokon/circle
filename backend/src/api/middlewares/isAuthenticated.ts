import { NextFunction, Request, Response } from 'express';
import { ApiResponse, InternalServerError, UnauthorizedError } from '../../utils';
import jwt from 'jsonwebtoken';
import { credentialService } from '../modules/bootstrap';
import { IUser } from '../modules/users/types';

export default async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) throw new Error('Unauthorized!');
    const decodedToken = jwt.decode(accessToken) as { user: IUser };
    if (!decodedToken.user?.id) throw new Error('Unauthorized!');
    const credential = await credentialService.getCredentialByUser({ userId: decodedToken.user.id });
    if (!credential?.dataValues?.id) throw new Error('Unauthorized!');

    const { user } = (await credentialService.verifyAccessToken(
      accessToken,
      credential?.dataValues?.password,
    )) as {
      user: IUser;
    };
    if (!user?.id) throw new Error('Unauthorized!');
    req.auth = { user };
    next();
  } catch (err) {
    if (err instanceof Error) {
      return new ApiResponse(res).error(new UnauthorizedError(err?.message));
    } else {
      return new ApiResponse(res).error(new InternalServerError('Something went wrong'));
    }
  }
}
