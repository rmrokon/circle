import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { credentialService, userService } from '../modules/bootstrap';
import { UnauthorizedError } from '../../utils';
import { IUser } from '../modules/users/types';

export default async function parseAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) throw new UnauthorizedError('Unauthorized!');
    const decodedToken = jwt.decode(accessToken) as { user: IUser };
    if (!decodedToken.user.id) throw new UnauthorizedError('Unauthorized!');
    const userFromDb = await userService.findUserById(decodedToken.user.id);
    if (!userFromDb?.id) throw new UnauthorizedError('Unauthorized!');
    const credential = await credentialService.getCredentialByUser({ userId: userFromDb.id });
    if (!credential?.dataValues?.id) throw new UnauthorizedError('Unauthorized!');
    const { user } = (await credentialService.verifyAccessToken(accessToken, credential?.dataValues?.password)) as {
      user: IUser;
    };
    if (!user.id) throw new UnauthorizedError('Unauthorized!');
    req.auth = { user };
    next();
  } catch (err) {
    console.log(err);
    next();
  }
}
