import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { credentialService, userService } from '../modules/bootstrap';
import { IUser } from '../modules/users/types';

export default async function hasValidAuthToken(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.headers.authorization?.split(' ')[1];
    if (!refreshToken) throw new Error('Unauthorized!');
    const decodedToken = jwt.decode(refreshToken) as { user: IUser };
    if (!decodedToken.user?.id) throw new Error('Unauthorized!');
    const userFromDb = await userService.findUserById(decodedToken.user?.id);
    if (!userFromDb?.id) throw new Error('Unauthorized!');
    const credential = await credentialService.getCredentialByUser({ userId: userFromDb.id });
    if (!credential?.dataValues?.id) throw new Error('Unauthorized!');

    const { user } = (await credentialService.verifyAccessToken(refreshToken, credential?.dataValues?.password)) as {
      user: IUser;
    };
    if (!user?.id) throw new Error('Unauthorized!');
    req.auth = {
      user,
    };
    next();
  } catch (err) {
    console.log(err);
    next();
  }
}
