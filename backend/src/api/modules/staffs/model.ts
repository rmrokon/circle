import { BelongsToManyGetAssociationsMixin, BelongsToManySetAssociationsMixin, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, HasManyGetAssociationsMixin, Model } from '@sequelize/core';
import { sequelize } from '../../../loaders/datasource';
import { StaffAvailablityStatus } from './types';

export default class Staff extends Model<InferAttributes<Staff>, InferCreationAttributes<Staff>> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare dailyCapacity: CreationOptional<number>;
    declare available: CreationOptional<StaffAvailablityStatus>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare setServiceTypes: BelongsToManySetAssociationsMixin<ServiceType, ServiceType["id"]>;
    declare getServiceTypes: BelongsToManyGetAssociationsMixin<ServiceType>;
    declare getAppointments: HasManyGetAssociationsMixin<Appointment>;
}

Staff.init(
    {
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        dailyCapacity: {
            field: 'daily_capacity',
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        available: {
            type: DataTypes.ENUM(...Object.values(StaffAvailablityStatus)),
            allowNull: false,
            defaultValue: StaffAvailablityStatus.available,
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
        tableName: 'staffs',
        modelName: 'Staff',
        sequelize,
    },
);

// Associations
import ServiceType from '../service-types/model';
import Appointment from '../appointments/model';

Staff.belongsToMany(ServiceType, {
    through: 'staff_service_types',
    foreignKey: 'staff_id',
    otherKey: 'service_type_id',
});

Staff.hasMany(Appointment, {
    foreignKey: {
        name: 'staffId',
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
});
