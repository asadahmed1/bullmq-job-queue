  BullMQ Job Queue Microservice

  BullMQ Job Queue Microservice
================================

![npm version](https://img.shields.io/npm/v/@queuelabs/bullmq-utils) ![downloads](https://img.shields.io/npm/dw/@queuelabs/bullmq-utils) ![license](https://img.shields.io/npm/l/@queuelabs/bullmq-utils) ![node version](https://img.shields.io/node/v/@queuelabs/bullmq-utils)

Production-ready **background job processing system for Node.js** using BullMQ and Redis. Handles emails, PDFs, webhooks, scheduling, and monitoring out of the box.

* * *

 What This Solves
------------------

*   Configure Redis connections (shared or per-worker)
*   Implement workers with concurrency and rate-limiter support
*   Handle retries, backoff, and timeouts
*   Schedule jobs for future execution
*   Integrate multiple email providers (Gmail / SendGrid / SMTP)
*   Monitor jobs with Bull Board
*   Docker-ready deployment

* * *

⚡ Features
----------

*    Add jobs via REST API
*    Email worker (SMTP / Gmail / SendGrid)
*    PDF worker for invoices & reports
*    Webhook worker with retries and timeout
*    Scheduled jobs
*    Bull Board admin dashboard
*    Input validation
*    Redis-backed queues
*    Exponential retry & backoff support
*    Docker-ready deployment
*    Graceful shutdown for workers
*    Worker configuration: `concurrency`, `limiter`, `timeout`

* * *

🏗 Architecture
---------------

Client → REST API → Queue → Redis → Worker → External Service
                                   ↓
                            Bull Board Admin UI

* * *

📦 Installation
---------------

    npm install @queuelabs/bullmq-utils

* * *

🔧 Quick Start
--------------

### Create Redis Connection

    import "dotenv/config";
    import { createRedisConnection } from "@queuelabs/bullmq-utils";
    
    const redis = createRedisConnection({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
    

* * *

### 📧 Email Worker Example (Gmail)

    import { startEmailWorker, emailQueue } from "@queuelabs/bullmq-utils";
    
    startEmailWorker({
      redis, // optional: defaults to shared Redis
      mail: {
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      },
      concurrency: 2, // optional, defaults to 1
      limiter: { max: 10, duration: 1000 }, // optional rate limiter
    });
    
    emailQueue.add(
      "sendEmail",
      { to: "recipient@example.com", subject: "Welcome 🚀", message: "Hello!" },
      { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
    );
    

#### Environment Variables

    
    REDIS_HOST=localhost
    REDIS_PORT=6379
    EMAIL_USER=your@gmail.com
    EMAIL_PASS=your_app_password
    

* * *

### 🌐 Webhook Worker Example

    import { startWebhookWorker, webhookQueue } from "@queuelabs/bullmq-utils";
    
    startWebhookWorker({
      redis,              // optional: defaults to shared Redis
      concurrency: 5,     // optional
      timeout: 10000,     // optional HTTP request timeout in ms
    });
    
    webhookQueue.add(
      "sendWebhook",
      { url: "https://example.com/webhook", payload: { event: "order.created" } },
      { attempts: 5, backoff: { type: "exponential", delay: 3000 } }
    );
    

* * *

### ⏰ Scheduled Jobs

    import { scheduleEmail, schedulePdf, scheduleWebhook } from "@queuelabs/bullmq-utils";
    
    // Schedule email for future
    await scheduleEmail(
      "recipient@example.com",
      "Scheduled Email",
      "This will be sent later ⏰",
      new Date(Date.now() + 60000) // 1 minute later
    );
    
    // Schedule PDF generation
    await schedulePdf("Invoice", "invoice.pdf", new Date(Date.now() + 60000));
    
    // Schedule webhook
    await scheduleWebhook("https://example.com/webhook", { orderId: 123 }, new Date(Date.now() + 60000));
    

* * *

📊 Monitor Jobs
---------------

Visit: **http://localhost:3000/admin/queues**

*   Active jobs
*   Completed jobs
*   Failed jobs
*   Retry attempts

* * *

🐳 Docker Deployment
--------------------

    docker run -d --name redis-server -p 6379:6379 redis

* * *

⚙ Production Capabilities
-------------------------

*   Shared Redis connections for multiple queues
*   Configurable concurrency & rate limiter per worker
*   Job timeouts
*   Graceful worker shutdown (SIGTERM / SIGINT)
*   Horizontal scaling support
*   Cloud-ready & containerized

* * *

💡 Example Use Cases
--------------------

*   Transactional emails (SaaS onboarding)
*   Background PDF generation (invoices, reports)
*   Reliable webhook delivery
*   Notification scheduling
*   External API retries

* * *

🗺 Roadmap
----------

*   Plugin-based custom job registration
*   Dead-letter queue (DLQ) support
*   Multi-tenant queue mode
*   Workflow orchestration layer
*   Observability integration

* * *

📜 License
----------

MIT © Queuelabs