import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { sequelize } from '../../../loaders/datasource';
import { ActivityType } from './types';

export default class Activity extends Model<InferAttributes<Activity>, InferCreationAttributes<Activity>> {
    declare id: CreationOptional<string>;
    declare type: ActivityType;
    declare message: string;
    declare metadata: CreationOptional<any>;
    declare createdAt: CreationOptional<Date>;
}

Activity.init(
    {
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        type: {
            type: DataTypes.ENUM(...Object.values(ActivityType)),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        timestamps: false,
        tableName: 'activities',
        modelName: 'Activity',
        sequelize,
    },
);
