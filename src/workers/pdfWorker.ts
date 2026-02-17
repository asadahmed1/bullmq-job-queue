import { Worker } from 'bullmq';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import { createRedisConnection, RedisConfig } from '../config/redis';
import { attachGracefulShutdown } from '../utils/gracefullShutdown';
import { WorkerConfig } from '../types/config';
import { getSharedRedis } from '../config/redisSingleton';

export function startPdfWorker(config?: WorkerConfig) {
  const connection = config?.redis ? createRedisConnection(config.redis) : getSharedRedis();

  const worker = new Worker(
    'pdfQueue',
    async (job) => {
      try {
        logger.info(`📄 PDF job received: ${job.id}`);
        const { userId, htmlContent } = job.data;

        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        const outputDir = path.resolve(__dirname, '../../generated-pdfs');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
        const filePath = path.join(outputDir, `invoice-${userId}-${job.id}.pdf`);
        fs.writeFileSync(filePath, pdfBuffer);

        logger.info(`✅ PDF generated and saved to ${filePath}`);
        return { path: filePath };
      } catch (err) {
        logger.error(`❌ PDF job failed`, { jobId: job.id, error: (err as Error).message });
        throw err;
      }
    },
    { connection,
      concurrency: config?.concurrency ?? 1,
      limiter: config?.limiter }
  );

  worker.on('completed', (job) => logger.info(`✅ PDF Job ${job.id} completed`));
  worker.on('failed', (job, err) => logger.error(`❌ PDF Job ${job?.id} failed: ${err.message}`));
  attachGracefulShutdown(worker);
  return worker;
}
