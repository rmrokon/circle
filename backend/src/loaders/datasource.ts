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
  ssl: {
    rejectUnauthorized: true,
    ca: CA_CERT,
  },
  pool: {
    max: 3, // Reduce max connections per pod
    min: 1,
    acquire: 20000, // Allow longer time to acquire a connection
    idle: 5000, // Reduce idle time to free up connections faster
  },
});


