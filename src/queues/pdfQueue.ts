import { Queue } from 'bullmq';
import { createRedisConnection } from '../config/redis';
import { scheduleJob } from '../utils/scheduler';

const connection = createRedisConnection({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const pdfQueue = new Queue('pdfQueue', { connection });

/**
 * ✅ New functionality: schedule a PDF generation job
 */
export async function schedulePdf(
  templateId: string,
  data: any,
  executeAt: string | Date
) {
  return scheduleJob(pdfQueue, "generatePdf", { templateId, data }, executeAt);
}