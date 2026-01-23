import { Attributes, CreationAttributes } from '@sequelize/core';
import type Staff from './model.js';

export enum StaffAvailablityStatus {
    available = 'available',
    onLeave = 'onLeave',
}

export interface IStaff extends Attributes<Staff> { }
export type ICreateStaff = CreationAttributes<Staff>;
