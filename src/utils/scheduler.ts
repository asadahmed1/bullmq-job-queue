// src/utils/scheduler.ts
import { Queue } from "bullmq";
import { emailQueue, pdfQueue, webhookQueue } from "../queues/queue";

/**
 * Generic scheduler for any queue
 */
export async function scheduleJob<T>(
  queue: Queue,
  name: string,
  data: T,
  runAt: Date | string | number
) {
  const delay =
    typeof runAt === "number"
      ? runAt
      : new Date(runAt).getTime() - Date.now();

  if (delay < 0) {
    throw new Error("Scheduled time must be in the future ⏰");
  }

  return queue.add(name, data, { delay });
}

/**
 * Convenience wrappers for each queue
 */
export async function scheduleEmail(
  to: string,
  subject: string,
  message: string,
  runAt: Date | string | number
) {
  return scheduleJob(emailQueue, "sendEmail", { to, subject, message }, runAt);
}

export async function schedulePdf(
  html: string,
  outputPath: string,
  runAt: Date | string | number
) {
  return scheduleJob(pdfQueue, "generatePdf", { html, outputPath }, runAt);
}

export async function scheduleWebhook(
  url: string,
  payload: any,
  runAt: Date | string | number
) {
  return scheduleJob(webhookQueue, "sendWebhook", { url, payload }, runAt);
}