  BullMQ Job Queue Microservice

🚀 BullMQ Job Queue Microservice for Node.js
============================================

### Background Jobs, Email Queues, Webhooks & Scheduled Tasks — Production Ready

![npm version](https://img.shields.io/npm/v/@queuelabs/bullmq-utils) ![downloads](https://img.shields.io/npm/dw/@queuelabs/bullmq-utils) ![license](https://img.shields.io/npm/l/@queuelabs/bullmq-utils) ![node version](https://img.shields.io/node/v/@queuelabs/bullmq-utils)

A production-ready **background job processing system for Node.js** built on BullMQ and Redis.

Stop wiring queues, retries, scheduling logic, email workers, dashboards, and Docker every time. Install once and start processing jobs in minutes.

* * *

✨ What This Solves
------------------

*   Configure Redis connections
*   Implement workers
*   Handle retries & backoff
*   Build scheduling logic
*   Integrate email providers
*   Add monitoring dashboard
*   Dockerize everything

This package gives you all of that out of the box.

* * *

🎯 Who Is This For?
-------------------

*   SaaS platforms sending transactional emails
*   E-commerce apps processing order webhooks
*   Systems generating PDF invoices in background
*   Teams that need Redis-based job queues fast
*   Developers tired of setting up BullMQ boilerplate

* * *

⚡ Features
----------

*   📥 Add jobs via REST API
*   📤 Email worker (SMTP / Gmail / SendGrid)
*   📝 PDF worker for reports & invoices
*   🌐 Webhook worker with retries
*   ⏰ Scheduled jobs
*   🖥 Admin dashboard via Bull Board
*   ✅ Input validation
*   ⚡ Redis-backed durability
*   🐳 Docker-ready deployment
*   🔁 Exponential retry & backoff support

* * *

🏗 Architecture Overview
------------------------

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

    
    require("dotenv").config();
    
    const { createRedisConnection } = require("@queuelabs/bullmq-utils");
    
    const redis = createRedisConnection({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });
    

* * *

📧 Email Worker (Gmail Example)
-------------------------------

    
    const { startEmailWorker, emailQueue } = require("@queuelabs/bullmq-utils");
    
    startEmailWorker({
      redis,
      mail: {
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    });
    
    emailQueue.add(
      "sendEmail",
      {
        to: "recipient@example.com",
        subject: "Welcome 🚀",
        message: "This email was sent using BullMQ background jobs!",
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
      }
    );
    

#### Environment Variables

    
    REDIS_HOST=localhost
    REDIS_PORT=6379
    EMAIL_USER=your@gmail.com
    EMAIL_PASS=your_app_password
    

* * *

🌐 Webhook Worker
-----------------

    
    const { startWebhookWorker, webhookQueue } = require("@queuelabs/bullmq-utils");
    
    startWebhookWorker({ redis });
    
    webhookQueue.add(
      "sendWebhook",
      {
        url: "https://example.com/webhook",
        payload: { event: "order.created", orderId: 12345 },
      },
      {
        attempts: 5,
        backoff: { type: "exponential", delay: 3000 },
      }
    );
    

* * *

⏰ Scheduled Jobs
----------------

### Scheduled Email

    
    const { scheduleEmail } = require("@queuelabs/bullmq-utils");
    
    await scheduleEmail(
      "recipient@example.com",
      "Scheduled Email",
      "This will be sent later ⏰",
      "2025-09-09T18:30:00Z"
    );
    

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

⚙ Production-Ready Capabilities
-------------------------------

*   Redis-based distributed processing
*   Exponential backoff retries
*   Scheduled job execution
*   Horizontal scaling (multiple workers)
*   Queue inspection dashboard
*   Cloud-ready deployment

* * *

💡 Example Use Cases
--------------------

*   Transactional email queue (SaaS onboarding)
*   Background invoice generation
*   Reliable webhook delivery
*   Notification scheduling
*   External API retry handling

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
