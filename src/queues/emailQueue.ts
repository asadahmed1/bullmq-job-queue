import { Queue } from 'bullmq';
import { createRedisConnection, RedisConfig } from '../config/redis';

/**
 * Factory for a BullMQ emailQueue with optional Redis config.
 * If config is omitted, uses environment variables or defaults.
 */
export function getEmailQueue(config?: RedisConfig) {
  const connection = createRedisConnection(config);
  return new Queue('emailQueue', { connection });
}

/**
 * Default emailQueue instance using env variables or defaults.
 * Most users can import this directly if they don't need custom credentials.
 */
export const emailQueue = getEmailQueue();