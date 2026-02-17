import { Queue } from 'bullmq';
import { timeOutSettings } from '../settings/setting';
import { getSharedRedis } from '../config/redisSingleton';

const connection = getSharedRedis();

function createQueue(name: string) {
  return new Queue(name, {
    connection,
    defaultJobOptions: timeOutSettings,
  });
}

export const emailQueue = createQueue('emailQueue');
export const pdfQueue = createQueue('pdfQueue');
export const webhookQueue = createQueue('webhookQueue');
