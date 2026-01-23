import { Attributes, CreationAttributes } from '@sequelize/core';
import type ServiceType from './model.js';

export interface IServiceType extends Attributes<ServiceType> { }
export type ICreateServiceType = CreationAttributes<ServiceType>;
