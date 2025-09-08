import { Queue } from 'bullmq';
import { createRedisConnection } from '../config/redis';
import { scheduleJob } from '../utils/scheduler';

const connection = createRedisConnection({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const emailQueue = new Queue('emailQueue', { connection })

/**
 * ✅ New functionality: schedule an email job
 * - Keeps old `.add()` usage working
 * - Adds a new helper for scheduling
 */
export async function scheduleEmail(
  to: string,
  subject: string,
  message: string,
  executeAt: string | Date
) {
  return scheduleJob(emailQueue, "sendEmail", { to, subject, message }, executeAt);
}