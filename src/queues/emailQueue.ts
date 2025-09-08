import { Queue } from 'bullmq';
import { createRedisConnection } from '../config/redis';

// Redis connection: explicit > env > default
const connection = createRedisConnection();

export const emailQueue = new Queue('emailQueue', { connection });