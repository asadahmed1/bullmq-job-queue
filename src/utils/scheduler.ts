import { emailQueue, pdfQueue, webhookQueue } from "../queues/queue";

/**
 * Generic helper for scheduling jobs on any queue.
 */
async function schedule(queue: any, name: string, data: any, runAt: Date | string | number) {
  const delay =
    typeof runAt === "number"
      ? runAt
      : new Date(runAt).getTime() - Date.now();

  if (delay < 0) {
    throw new Error("⏰ Scheduled time must be in the future");
  }

  return queue.add(name, data, { delay });
}

/**
 * Schedule Email
 */
export function scheduleEmail(to: string, subject: string, message: string, runAt: Date | string | number) {
  return schedule(emailQueue, "sendEmail", { to, subject, message }, runAt);
}

/**
 * Schedule PDF
 */
export function schedulePdf(html: string, outputPath: string, runAt: Date | string | number) {
  return schedule(pdfQueue, "generatePdf", { html, outputPath }, runAt);
}

/**
 * Schedule Webhook
 */
export function scheduleWebhook(url: string, payload: any, runAt: Date | string | number) {
  return schedule(webhookQueue, "sendWebhook", { url, payload }, runAt);
}
