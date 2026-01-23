import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { sequelize } from '../../../loaders/datasource';

export default class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service>> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare duration: number;
    declare serviceTypeId: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Service.init(
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
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        serviceTypeId: {
            field: 'service_type_id',
            type: DataTypes.UUID,
            allowNull: false,
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
        tableName: 'services',
        modelName: 'Service',
        sequelize,
    },
);

// Associations
import ServiceType from '../service-types/model';
import Appointment from '../appointments/model';

Service.belongsTo(ServiceType, {
    foreignKey: {
        name: 'serviceTypeId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
});

Service.hasMany(Appointment, {
    foreignKey: {
        name: 'serviceId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
});
