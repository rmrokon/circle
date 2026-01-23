import { logger } from '../libs';
import { sequelize } from './datasource';
import createServer from './express';

export interface LoadersConfig {
  port: string | number;
}

export default (function Loaders() {
  return {
    async load(config: LoadersConfig) {
      return Promise.all([await loadDatabase(), await loadExpress(config.port)]);
    },
  };
})();

async function loadDatabase() {
  try {
    const connection = await sequelize.sync({ alter: true });
    logger.info('🗃️  Database connected...');
    logger.info(`✅ All models are created successfully.`);
    // await tableLoader();
    return connection;
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof Error) {
      logger.error(`🌋 Database connection failed - ${err?.message}`, {
        error: { stack: err, message: err.message },
      });
    }
  }
}

async function loadExpress(port: LoadersConfig['port']) {
  try {
    const server = await createServer();
    logger.info('📦 ExpressJS Loaded...');

    const serverRes = server.listen(port);

    return serverRes;
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(err.message, '🌋 ExpressJS failed to load...');
    }
  }
}
