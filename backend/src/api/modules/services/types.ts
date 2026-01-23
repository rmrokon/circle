import { Attributes, CreationAttributes } from '@sequelize/core';
import type Service from './model.js';

export interface IService extends Attributes<Service> { }
export type ICreateService = CreationAttributes<Service>;
