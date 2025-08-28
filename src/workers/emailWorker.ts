import { Worker } from 'bullmq';
import sgMail from '@sendgrid/mail';
import { logger } from '../utils/logger';
import IORedis from 'ioredis';
import { EmailWorkerConfig } from '../types/config';

export function startEmailWorker(config?: EmailWorkerConfig) {
  const redisConnection = config?.redis
    ? new IORedis({
      host: config.redis.host,
      port: config.redis.port,
      maxRetriesPerRequest: null,
    })
    : undefined;

  const connection = redisConnection ?? require('../config/redis').connection;

  const sendgridApiKey = config?.mail?.apiKey || process.env.SENDGRID_API_KEY;
  const mailFrom = config?.mail?.from || process.env.MAIL_FROM;

  if (!sendgridApiKey || !mailFrom) {
    throw new Error('Missing SendGrid API key or MAIL_FROM address');
  }
  sgMail.setApiKey(sendgridApiKey);
  const worker = new Worker(
    'emailQueue',
    async (job) => {
      const { to, subject, message } = job.data;
      await sgMail.send({
        to,
        from: mailFrom,
        subject,
        text: message,
      });
      logger.info(`Email sent to ${to}`);
    },
    { connection }
  );

  worker.on('completed', (job) => {
    logger.info(`✅ Email job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`❌ Email job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}