# 🧵 BullMQ Job Queue Microservice

A scalable, production-ready Node.js microservice for background job processing using [BullMQ](https://docs.bullmq.io/), Redis, and TypeScript.

🔨 Handles:
- ✉️ Email Jobs (via SendGrid)
- 📄 PDF Generation (via Puppeteer)
- 🔗 Webhook Dispatch (via Axios)
- 📊 Real-time Job Monitoring (via Bull Board)

---

## ✨ Features

- Modular queues: email, PDF, webhook
- Retry with exponential backoff
- PDF preview via API
- Job dashboard at `/admin/queues`
- Logging via Winston
- Optional Sentry error monitoring
- Scalable via worker separation
- Heartbeat check to detect offline workers

---

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/your-username/bullmq-microservice.git
cd bullmq-microservice
npm install
cp .env.example .env
docker run -d --name redis -p 6379:6379 redis
# Start Express API
npx ts-node src/server.ts

# Start workers
npx ts-node src/workers/emailWorker.ts
npx ts-node src/workers/pdfWorker.ts
npx ts-node src/workers/webhookWorker.ts

POST /api/jobs/send-email
Content-Type: application/json

{
  "to": "test@example.com",
  "subject": "Hello",
  "message": "Welcome to our service"
}
POST /api/jobs/generate-pdf
Content-Type: application/json

{
  "userId": "abc123",
  "htmlContent": "<h1>Invoice</h1><p>Thank you for your purchase</p>"
}
POST /api/jobs/trigger-webhook
Content-Type: application/json

{
  "url": "https://webhook.site/your-id",
  "payload": {
    "event": "user.created",
    "user": {
      "id": "u123",
      "email": "user@example.com"
    }
  }
}

| Type    | Queue          | Worker File                    |
| ------- | -------------- | ------------------------------ |
| Email   | `emailQueue`   | `src/workers/emailWorker.ts`   |
| PDF     | `pdfQueue`     | `src/workers/pdfWorker.ts`     |
| Webhook | `webhookQueue` | `src/workers/webhookWorker.ts` |
