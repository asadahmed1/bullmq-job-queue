import { Worker } from 'bullmq';
import sgMail from '@sendgrid/mail';
import { logger } from '../utils/logger';
import IORedis from 'ioredis';
import { EmailWorkerConfig } from '../types/config';
import nodemailer from 'nodemailer';


/**
 * Start an email worker with the given configuration.
 *
 * If `config` is provided, its `redis` property will be used to create a Redis
 * connection. Otherwise, the default connection will be used.
 *
 * If `config.mail.apiKey` and `config.mail.from` are provided, the worker will
 * use SendGrid to send emails. Otherwise, if `config.mail.auth.user` and
 * `config.mail.auth.pass` are provided, the worker will use Gmail via Nodemailer
 * to send emails. In either case, the worker will throw an error if the
 * configuration is missing or invalid.
 *
 * The worker will listen to the "emailQueue" queue and process jobs with the
 * following shape: `{ to: string, subject: string, message: string }`.
 *
 * @param {EmailWorkerConfig} [config] - Optional configuration
 * @returns {Worker} - The email worker
 */
export function startEmailWorker(config?: EmailWorkerConfig) {
  const redisConnection = config?.redis
    ? new IORedis({
      host: config.redis.host,
      port: config.redis.port,
      maxRetriesPerRequest: null,
    })
    : undefined;

  const connection = redisConnection ?? require('../config/redis').connection;

  // Check SendGrid credentials
  const sendgridApiKey = config?.mail?.apiKey || process.env.SENDGRID_API_KEY;
  const mailFrom = config?.mail?.from || process.env.MAIL_FROM;

  // Check Gmail credentials
  const gmailUser = config?.mail?.auth?.user || process.env.GMAIL_USER;
  const gmailPass = config?.mail?.auth?.pass || process.env.GMAIL_PASS;

  let sendEmail: (opts: { to: string; subject: string; message: string }) => Promise<void>;

  if (sendgridApiKey && mailFrom) {
    // ✅ SendGrid transport
    sgMail.setApiKey(sendgridApiKey);
    sendEmail = async ({ to, subject, message }) => {
      await sgMail.send({ to, from: mailFrom, subject, text: message });
    };
    logger.info("📨 Email worker using SendGrid");
  } else if (gmailUser && gmailPass) {
    // ✅ Gmail via Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
    sendEmail = async ({ to, subject, message }) => {
      await transporter.sendMail({
        from: gmailUser,
        to,
        subject,
        text: message,
      });
    };
    logger.info("📨 Email worker using Gmail (Nodemailer)");
  } else {
    throw new Error("Missing email configuration (SendGrid or Gmail).");
  }

  const worker = new Worker(
    "emailQueue",
    async (job) => {
      const { to, subject, message } = job.data;
      await sendEmail({ to, subject, message });
      logger.info(`Email sent to ${to}`);
    },
    { connection }
  );

  worker.on("completed", (job) => {
    logger.info(`✅ Email job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`❌ Email job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}