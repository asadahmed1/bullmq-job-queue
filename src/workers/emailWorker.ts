import { Worker } from 'bullmq';
import sgMail from '@sendgrid/mail';
import { logger } from '../utils/logger';
import nodemailer from 'nodemailer';
import { createRedisConnection } from '../config/redis';
import type { EmailWorkerConfig } from '../types/config';

export function startEmailWorker(config?: EmailWorkerConfig) {
  // Redis connection: explicit > env > default
  const connection = config?.redis
    ? createRedisConnection(config.redis)
    : createRedisConnection();

  // Check SendGrid credentials
  const sendgridApiKey = config?.mail?.apiKey || process.env.SENDGRID_API_KEY;
  const mailFrom = config?.mail?.from || process.env.MAIL_FROM;

  // Check Gmail credentials
  const gmailUser = config?.mail?.auth?.user || process.env.GMAIL_USER;
  const gmailPass = config?.mail?.auth?.pass || process.env.GMAIL_PASS;

  let sendEmail: (opts: { to: string; subject: string; message: string }) => Promise<void>;

  if (sendgridApiKey && mailFrom) {
    sgMail.setApiKey(sendgridApiKey);
    sendEmail = async ({ to, subject, message }) => {
      await sgMail.send({ to, from: mailFrom, subject, text: message });
    };
    logger.info('📨 Email worker using SendGrid');
  } else if (gmailUser && gmailPass) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    });
    sendEmail = async ({ to, subject, message }) => {
      await transporter.sendMail({ from: gmailUser, to, subject, text: message });
    };
    logger.info('📨 Email worker using Gmail (Nodemailer)');
  } else {
    throw new Error('Missing email configuration (SendGrid or Gmail).');
  }

  const worker = new Worker(
    'emailQueue',
    async (job) => {
      const { to, subject, message } = job.data;
      await sendEmail({ to, subject, message });
      logger.info(`Email sent to ${to}`);
    },
    { connection }
  );

  worker.on('completed', (job) => logger.info(`✅ Email job ${job.id} completed`));
  worker.on('failed', (job, err) => logger.error(`❌ Email job ${job?.id} failed: ${err.message}`));

  return worker;
}