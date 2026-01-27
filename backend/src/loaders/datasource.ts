import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, CA_CERT } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT || !CA_CERT)
  throw new Error(
    `DB env variables are missing, required variables are - DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, CA_CERT`,
  );

export const sequelize = new Sequelize<PostgresDialect>({
  dialect: PostgresDialect,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  logging: false,
  retry: {
    max: 3,
  },
  // For development environment disable ssl
  ssl: {
    rejectUnauthorized: true,
    ca: CA_CERT,
  },
  pool: {
    max: 3,
    min: 1,
    acquire: 20000,
    idle: 5000,
  },
});


