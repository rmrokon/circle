import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { sequelize } from '../../../loaders/datasource';
import { AppointmentStatus } from './types';

export default class Appointment extends Model<InferAttributes<Appointment>, InferCreationAttributes<Appointment>> {
    declare id: CreationOptional<string>;
    declare customerName: string;
    declare serviceId: string;
    declare staffId: string;
    declare appointmentDateTime: Date;
    declare status: CreationOptional<AppointmentStatus>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Appointment.init(
    {
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        customerName: {
            field: 'customer_name',
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        serviceId: {
            field: 'service_id',
            type: DataTypes.UUID,
            allowNull: false,
        },
        staffId: {
            field: 'staff_id',
            type: DataTypes.UUID,
            allowNull: false,
        },
        appointmentDateTime: {
            field: 'appointment_date_time',
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(AppointmentStatus)),
            allowNull: false,
            defaultValue: AppointmentStatus.Scheduled,
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        timestamps: false,
        tableName: 'appointments',
        modelName: 'Appointment',
        sequelize,
    },
);

// Associations
import Service from '../services/model';
import Staff from '../staffs/model';

Appointment.belongsTo(Service, {
    foreignKey: {
        name: 'serviceId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
});

Appointment.belongsTo(Staff, {
    foreignKey: {
        name: 'staffId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
});
