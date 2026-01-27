import UserController from './users/controller';
import User from './users/model';
import UserRepository from './users/repository';
import CredentialRepository from './credentials/repository';
import CredentialService from './credentials/service';
import CredentialController from './credentials/controller';
import Credential from './credentials/model';
import UserService from './users/service';

// Credentials
export const credentialRepository = new CredentialRepository(Credential);
export const credentialService = new CredentialService(credentialRepository);
export const credentialController = new CredentialController(credentialService);

// Users
export const userRepository = new UserRepository(User);
export const userService = new UserService(userRepository);
export const userController = new UserController(userService);

// Staffs
import Staff from './staffs/model';
import StaffRepository from './staffs/repository';
import StaffService from './staffs/service';
import StaffController from './staffs/controller';

export const staffRepository = new StaffRepository(Staff);
export const staffService = new StaffService(staffRepository);
export const staffController = new StaffController(staffService);

// ServiceTypes
import ServiceType from './service-types/model';
import ServiceTypeRepository from './service-types/repository';
import ServiceTypeService from './service-types/service';
import ServiceTypeController from './service-types/controller';

export const serviceTypeRepository = new ServiceTypeRepository(ServiceType);
export const serviceTypeService = new ServiceTypeService(serviceTypeRepository);
export const serviceTypeController = new ServiceTypeController(serviceTypeService);

// Services
import Service from './services/model';
import ServiceRepository from './services/repository';
import ServiceService from './services/service';
import ServiceController from './services/controller';

export const serviceRepository = new ServiceRepository(Service);
export const serviceService = new ServiceService(serviceRepository);
export const serviceController = new ServiceController(serviceService);

// Appointments
import Appointment from './appointments/model';
import AppointmentRepository from './appointments/repository';
import AppointmentService from './appointments/service';
import AppointmentController from './appointments/controller';

export const appointmentRepository = new AppointmentRepository(Appointment);
export const appointmentService = new AppointmentService(appointmentRepository);
export const appointmentController = new AppointmentController(appointmentService);

// Activities
import Activity from './activities/model';
import ActivityRepository from './activities/repository';
import ActivityService from './activities/service';
import ActivityController from './activities/controller';

export const activityRepository = new ActivityRepository(Activity);
export const activityService = new ActivityService(activityRepository);
export const activityController = new ActivityController(activityService);
