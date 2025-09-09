import "dotenv/config";
import IORedis from 'ioredis';
import type { RedisOptions } from 'ioredis';

export type RedisConfig = {
  host?: string;
  port?: number;
  password?: string;
};

function parsePort(portValue: unknown): number {
  const port = Number(portValue);
  return Number.isFinite(port) && port > 0 && port < 65536 ? port : 6379;
}

export function createRedisConnection(config: RedisConfig = {}): IORedis {
  const options: RedisOptions = {
    host: config.host ?? process.env.REDIS_HOST ?? 'localhost',
    port: parsePort(config.port ?? process.env.REDIS_PORT),
    password: config.password ?? process.env.REDIS_PASS,
    maxRetriesPerRequest: null, // Required for BullMQ
  };
  const redis = new IORedis(options);

  redis.on('connect', () => console.log('✅ Redis connected!'));
  redis.on('error', (err) => console.error('❌ Redis Error:', err));

  return redis;
}