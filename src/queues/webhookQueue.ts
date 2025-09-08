import { Queue } from 'bullmq';
import { createRedisConnection } from '../config/redis';
import { scheduleJob } from '../utils/scheduler';

const connection = createRedisConnection({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const webhookQueue = new Queue('webhookQueue', { connection });

/**
 * Schedule a webhook for a future time
 */
export async function scheduleWebhook(
  url: string,
  payload: any,
  executeAt: string | Date
) {
  return scheduleJob(webhookQueue, "sendWebhook", { url, payload }, executeAt);
}