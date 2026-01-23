import { logger } from '../libs';

export default function logPromises<T>(promises: PromiseSettledResult<T>[]) {
  promises.forEach((promise) => {
    if (promise.status === 'fulfilled') {
      logger.info(`Scripts --> ${JSON.stringify(promise.value, undefined, 5)} --> Finished`);
    } else {
      logger.error(`Scripts --> ${promise.reason} --> Failed`);
    }
  });
}
