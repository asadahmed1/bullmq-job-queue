import { Worker } from 'bullmq';
import { webhookQueue } from '../queues/queue';
import { logger } from '../utils/logger';
import axios from 'axios';
import { createRedisConnection } from '../config/redis';

const connection = createRedisConnection({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});
export function startwebhookWorker() {
  const worker = new Worker(
    'webhookQueue',
    async (job) => {
      try {
        logger.info(`🔗 Webhook job received: ${job.id}`);

        const { url, payload } = job.data;

        const response = await axios.post(url, payload);

        logger.info(`📬 Webhook sent to ${url}, status: ${response.status}`);
      } catch (err) {
        logger.error(`❌ Webhook job failed`, { jobId: job.id, error: (err as Error).message });
        throw err;
      }
    },
    { connection }
  );

  worker.on('completed', (job) => {
    logger.info(`✅ Webhook Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`❌ Webhook Job ${job?.id} failed: ${err.message}`);
  });
  return worker;
}