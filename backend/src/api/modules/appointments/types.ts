import { Attributes, CreationAttributes } from '@sequelize/core';
import type Appointment from './model.js';

export enum AppointmentStatus {
    Scheduled = 'Scheduled',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
    'No-Show' = 'No-Show',
}

export interface IAppointment extends Attributes<Appointment> { }
export type ICreateAppointment = CreationAttributes<Appointment>;
