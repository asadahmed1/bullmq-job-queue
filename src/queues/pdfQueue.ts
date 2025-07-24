import { Queue } from 'bullmq';
import { connection } from '../config/redis';

export const pdfQueue = new Queue('pdfQueue', { connection });