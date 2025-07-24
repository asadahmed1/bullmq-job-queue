import { Router, Request, Response } from 'express';
import { emailQueue, pdfQueue, webhookQueue } from '../queues/queue';
import Joi from 'joi';
import { timeOutSettings } from '../settings/setting';

const router = Router();

const jobSchema = Joi.object({
  to: Joi.string().email().required(),
  subject: Joi.string().required(),
  message: Joi.string().required(),
});

router.post('/send-email', async (req, res) => {
  const { error, value } = jobSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.message })
    return;
  };

  const job = await emailQueue.add('sendEmail', value, timeOutSettings);

  res.json({ jobId: job.id });
});
router.post('/generate-pdf', async (req, res) => {
  const { userId, htmlContent } = req.body;
  if (!userId || !htmlContent) {
    res.status(400).json({ error: 'Missing userId or htmlContent' });
    return;
  }
  const job = await pdfQueue.add('generatePDF', { userId, htmlContent }, timeOutSettings);

  res.json({ jobId: job.id });
});

// Webhook job
router.post('/trigger-webhook', async (req, res) => {
  const { url, payload } = req.body;
  if (!url || !payload) {
    res.status(400).json({ error: 'Missing url or payload' });
    return;
  }

  const job = await webhookQueue.add('triggerWebhook', { url, payload }, timeOutSettings);

  res.json({ jobId: job.id });
});

export default router;