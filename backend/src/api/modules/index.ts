import { CredentialRouter } from './credentials';
import { UserRouter } from './users';
import { StaffRouter } from './staffs';
import { ServiceTypeRouter } from './service-types';
import { ServiceRouter } from './services';
import { AppointmentRouter } from './appointments';
import { ActivityRouter } from './activities';
import { StatsRouter } from './stats';

export const API = {
  '/credentials': CredentialRouter,
  '/users': UserRouter,
  '/staffs': StaffRouter,
  '/service-types': ServiceTypeRouter,
  '/services': ServiceRouter,
  '/appointments': AppointmentRouter,
  '/activities': ActivityRouter,
  '/stats': StatsRouter,
};
