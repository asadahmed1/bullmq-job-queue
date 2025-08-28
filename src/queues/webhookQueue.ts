import { Queue } from 'bullmq';
import { createRedisConnection } from '../config/redis';

const connection = createRedisConnection({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const webhookQueue = new Queue('webhookQueue', { connection });