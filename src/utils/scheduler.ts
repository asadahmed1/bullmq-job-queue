// utils/scheduler.ts
import { Queue } from "bullmq";

/**
 * Schedule a job to run at a specific time.
 *
 * @param queue - The BullMQ queue (emailQueue, webhookQueue, pdfQueue, etc.)
 * @param name - The job name (e.g. "sendEmail")
 * @param data - The job payload
 * @param executeAt - Date or ISO string for when to run
 */
export async function scheduleJob(
  queue: Queue<any>,
  name: string,
  data: Record<string, any>,
  executeAt: string | Date
) {
  const date = executeAt instanceof Date ? executeAt : new Date(executeAt);
  const delay = date.getTime() - Date.now();

  if (delay <= 0) {
    throw new Error("executeAt must be in the future");
  }

  return queue.add(name, data, { delay });
}