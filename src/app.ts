import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import jobRoutes from './routes/jobs';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { pdfQueue, webhookQueue, emailQueue } from './queues/queue';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/jobs', jobRoutes);

// Setup Bull Board admin UI
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(emailQueue),
  new BullMQAdapter(pdfQueue),
  new BullMQAdapter(webhookQueue),],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

export default app;