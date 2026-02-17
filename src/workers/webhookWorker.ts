import { Worker } from 'bullmq';
import axios from 'axios';
import { logger } from '../utils/logger';
import { createRedisConnection } from '../config/redis';
import type { RedisConfig, WorkerConfig } from '../types/config';
import { attachGracefulShutdown } from '../utils/gracefullShutdown';
import { getSharedRedis } from '../config/redisSingleton';

/**
 * Starts the webhook worker.
 *
 * @param redisConfig Optional. If provided, uses these Redis connection params.
 *                    Otherwise, uses environment variables/defaults.
 */
export function startWebhookWorker(config?: WorkerConfig) {
  const connection = config?.redis ? createRedisConnection(config.redis) : getSharedRedis();
  const timeout = config?.timeout ?? 10000;
  const worker = new Worker(
    'webhookQueue',
    async (job) => {
      try {
        logger.info(`🔗 Webhook job received: ${job.id}`);
        const { url, payload } = job.data;
        const response = await axios.post(url, payload,{
          timeout
        });
        logger.info(`📬 Webhook sent to ${url}, status: ${response.status}`);
      } catch (err) {
        logger.error(`❌ Webhook job failed`, { jobId: job.id, error: (err as Error).message });
        throw err;
      }
    },
    { connection,
      concurrency: config?.concurrency ?? 1,
      limiter: config?.limiter }
  );

  worker.on('completed', (job) =>
    logger.info(`✅ Webhook Job ${job.id} completed`)
  );
  worker.on('failed', (job, err) =>
    logger.error(`❌ Webhook Job ${job?.id} failed: ${err.message}`)
  );
  attachGracefulShutdown(worker);
  return worker;
}