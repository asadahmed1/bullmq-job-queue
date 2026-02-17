import { Worker } from "bullmq";
import { logger } from "./logger";

export function attachGracefulShutdown(worker: Worker) {
    const shutdown = async () => {
      try {
        logger.info("Shutting down worker...");
        await worker.close();
        process.exit(0);
      } catch (err) {
        logger.error("Error during worker shutdown", { error: (err as Error).message });
        process.exit(1);
      }
    };
  
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown); // Handles Ctrl+C in local dev
  }
