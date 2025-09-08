import { Queue } from 'bullmq';
import { createRedisConnection } from '../config/redis';

const connection = createRedisConnection();

export const pdfQueue = new Queue('pdfQueue', { connection });