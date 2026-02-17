import "dotenv/config";
import { startEmailWorker } from './workers/emailWorker';
import { startPdfWorker } from './workers/pdfWorker';
import { startWebhookWorker } from './workers/webhookWorker';
import { logger } from "./utils/logger";

const workerType = process.argv[2]; // Get the command-line argument

switch (workerType) {
  case 'email':
    startEmailWorker();
    logger.info('📨 Email worker started.');
    break;
  case 'pdf':
    startPdfWorker();
    logger.info('📄 PDF worker started.');
    break;
  case 'webhook':
    startWebhookWorker();
    logger.info('🔗 Webhook worker started.');
    break;
  default:
    logger.info('❌ Invalid worker type. Use: email, pdf, or webhook.');
    process.exit(1);
}