import IORedis from 'ioredis';
import type { RedisOptions } from 'ioredis';

export type RedisConfig = {
  host?: string;
  port?: number;
  password?: string;
};

export function createRedisConnection(config: RedisConfig = {}): IORedis {
  const options: RedisOptions = {
    host: config.host ?? process.env.REDIS_HOST ?? 'localhost',
    port: config.port ?? Number(process.env.REDIS_PORT) ?? 6379,
    password: config.password ?? process.env.REDIS_PASS,
    maxRetriesPerRequest: null, // Required for BullMQ
  };

  const redis = new IORedis(options);

  redis.on('connect', () => console.log('✅ Redis connected!'));
  redis.on('error', (err) => console.error('❌ Redis Error:', err));

  return redis;
}