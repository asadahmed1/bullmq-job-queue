import { Queue } from 'bullmq';
import { connection } from '../config/redis';

export const emailQueue = new Queue('emailQueue', { connection });
export const pdfQueue = new Queue('pdfQueue', { connection });
export const webhookQueue = new Queue('webhookQueue', { connection });