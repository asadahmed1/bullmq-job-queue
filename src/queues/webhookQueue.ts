import { Queue } from 'bullmq';
import { connection } from '../config/redis';

export const webhookQueue = new Queue('webhookQueue', { connection });