import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { sequelize } from '../../../loaders/datasource';

export default class ServiceType extends Model<InferAttributes<ServiceType>, InferCreationAttributes<ServiceType>> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

ServiceType.init(
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
        tableName: 'service_types',
        modelName: 'ServiceType',
        sequelize,
    },
);

// Associations
import Staff from '../staffs/model';
import Service from '../services/model';

ServiceType.belongsToMany(Staff, {
    through: 'staff_service_types',
    foreignKey: 'service_type_id',
    otherKey: 'staff_id',
});

ServiceType.hasMany(Service, {
    foreignKey: {
        name: 'serviceTypeId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
});
