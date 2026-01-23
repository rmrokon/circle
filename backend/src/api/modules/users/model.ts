import { CreationOptional, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasOneGetAssociationMixin, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { sequelize } from '../../../loaders/datasource';
import Credential from '../credentials/model';
import { UserType } from './types';

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare getCredential: HasOneGetAssociationMixin<Credential>;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
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
    tableName: 'users',
    modelName: 'User',
    sequelize,
  },
);
