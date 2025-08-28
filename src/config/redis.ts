import IORedis from 'ioredis';
import type { RedisOptions } from 'ioredis';

export type RedisConfig = {
  host: string;
  port: number;
  password?: string;
};

/**
 * Create a Redis connection compatible with BullMQ.
 * Includes required `maxRetriesPerRequest: null`.
 */
export function createRedisConnection(config: RedisConfig): IORedis {
  const options: RedisOptions = {
    host: config.host,
    port: config.port,
    password: config.password,
    maxRetriesPerRequest: null, // ✅ Required for BullMQ
  };

  return new IORedis(options);
}