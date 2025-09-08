import { Queue } from 'bullmq';
import { createRedisConnection } from '../config/redis';

const connection = createRedisConnection();

export const webhookQueue = new Queue('webhookQueue', { connection });