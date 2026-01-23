/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from 'express';
import { ApiResponse, InternalServerError, UnauthorizedError } from '../../utils';

export default function requireAuthor(req: Request, res: Response, next: NextFunction) {
  try {
    const author = req?.auth?.author;
    if (!author) throw new Error('Unauthorized');
    next();
  } catch (err) {
    if (err instanceof Error) {
      return new ApiResponse(res).error(new UnauthorizedError(err?.message));
    } else {
      return new ApiResponse(res).error(new InternalServerError('Something went wrong'));
    }
  }
}
