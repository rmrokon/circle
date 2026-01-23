import cors from 'cors';
import express from 'express';
import Routes from '../api';
import { NotFound } from '../utils';
import swaggerLoader from './swagger';

export default async function createServer() {
  const app = express();

  app.use([
    cors({ origin: '*', credentials: true }),
    express.json({ limit: '10mb' }),
    express.urlencoded({ extended: true, limit: '10mb' }),
  ]);

  swaggerLoader(app);

  app.get('/', async (_, res) => {
    res.status(200).send('Hello from API...');
  });
  app.use('/v1', Routes());

  app.all('*', (req, _res, next) => {
    next(new NotFound(`Not found - ${req.url}`));
  });

  return app;
}
