/* eslint-disable @typescript-eslint/no-namespace */
import 'dotenv/config';
import { logger } from './libs';
import Loaders from './loaders';
import { IUser } from './api/modules/users/types';
// console.log(process.env);
const { PROTOCOL, HOST, PORT, NODE_ENV } = process.env;
if (!PROTOCOL || !HOST || !PORT || !NODE_ENV) {
  throw new Error(`PROTOCOL, HOST, PORT, NODE_ENV these env must be set`);
}

Loaders.load({
  port: PORT!,
}).then(() => {
  logger.info(`🚀 The server is running on ${PROTOCOL}://${HOST}:${PORT} on ${NODE_ENV} mode.`);
});

declare global {
  namespace Express {
    interface Request {
      auth: {
        user: IUser;
      };
    }
  }
}
