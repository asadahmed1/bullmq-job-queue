import { Worker } from 'bullmq';
import { pdfQueue } from '../queues/queue';
import { connection } from '../config/redis';
import { logger } from '../utils/logger';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
export function startPdfWorker() {
const worker = new Worker(
  'pdfQueue',
  async (job) => {
    try {
      logger.info(`📄 PDF job received: ${job.id}`);

      const { userId, htmlContent } = job.data;

      // ✅ Generate PDF from HTML using puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      await browser.close();

      // ✅ Save to disk (optional)
      const outputDir = path.resolve(__dirname, '../../generated-pdfs');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
      console.log(`Output directory: ${outputDir}`);
      const filePath = path.join(outputDir, `invoice-${userId}-${job.id}.pdf`);
      fs.writeFileSync(filePath, pdfBuffer);

      logger.info(`✅ PDF generated and saved to ${filePath}`);

      return { path: filePath };

    } catch (err) {
      logger.error(`❌ PDF job failed`, {
        jobId: job.id,
        error: (err as Error).message,
      });
      throw err;
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  logger.info(`✅ PDF Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  logger.error(`❌ PDF Job ${job?.id} failed: ${err.message}`);
});
return worker;
}