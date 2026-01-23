import { Router } from 'express';
import { API } from './modules';

export default function Routes() {
  const router = Router();

  Object.keys(API).forEach((key) => router.use(key, API[key as keyof typeof API]));

  return router;
}
