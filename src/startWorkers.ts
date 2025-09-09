import "dotenv/config";
import { startEmailWorker } from './workers/emailWorker';
import { startPdfWorker } from './workers/pdfWorker';
import { startWebhookWorker } from './workers/webhookWorker';

const workerType = process.argv[2]; // Get the command-line argument

switch (workerType) {
  case 'email':
    startEmailWorker();
    console.log('📨 Email worker started.');
    break;
  case 'pdf':
    startPdfWorker();
    console.log('📄 PDF worker started.');
    break;
  case 'webhook':
    startWebhookWorker();
    console.log('🔗 Webhook worker started.');
    break;
  default:
    console.error('❌ Invalid worker type. Use: email, pdf, or webhook.');
    process.exit(1);
}