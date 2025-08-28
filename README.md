# 📬 BullMQ Job Queue Microservice (Email, PDF & Webhooks)

[![npm version](https://img.shields.io/npm/v/@queuelabs/bullmq-utils)](https://www.npmjs.com/package/@queuelabs/bullmq-utils)
[![downloads](https://img.shields.io/npm/dm/@queuelabs/bullmq-utils)](https://www.npmjs.com/package/@queuelabs/bullmq-utils)
![license](https://img.shields.io/badge/license-MIT-blue.svg)
![node](https://img.shields.io/badge/node-%3E%3D18-green.svg)

A **production-ready Node.js microservice** for background job processing using **BullMQ**, **Redis**, and **Express**.  
Supports **Email**, **PDF generation**, and **Webhook jobs** with a built-in admin dashboard (Bull Board).  

---

## 🚀 Features

- 📥 Add jobs via a REST API  
- 📤 Email worker using Nodemailer  
- 📝 PDF worker for document/report generation  
- 🌐 Webhook worker for external integrations  
- 🖥️ Bull Board Admin UI (`/admin/queues`)  
- ✅ Input validation with Joi  
- ⚡ Redis-backed job queue (BullMQ)  
- 🐳 Docker-ready for local or cloud deployment  

---

## 🧰 Tech Stack

- **Node.js** (v18+)  
- **Express**  
- **BullMQ** (Redis-based queue)  
- **Redis**  
- **Nodemailer**  
- **Bull Board**  
- **TypeScript**  

---

## 📂 Project Structure

```bash
job-queue-service/
├── src/
│   ├── queues/        # Job queue definitions (e.g., emailQueue.ts)
│   ├── workers/       # Job processors (email, pdf, webhook, etc.)
│   ├── routes/        # Express API routes
│   ├── app.ts         # Express app setup
│   └── server.ts      # Entry point
├── .env
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🛠️ Prerequisites

- Node.js `v18+`  
- Redis (local install or via Docker)  
- Docker (optional but recommended)  
- Gmail, Mailtrap, or any SMTP server (for email testing)  

---

## 📥 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/queuelabs/bullmq-utils.git
cd bullmq-utils
npm install
```

### 2. Start Redis (Docker example)
```bash
docker run -d --name redis-server -p 6379:6379 redis
```

### 3. Run the Service
```bash
npx ts-node src/server.ts
```

### 4. Start Workers
```bash
npx ts-node src/workers/emailWorker.ts
npx ts-node src/workers/pdfWorker.ts
npx ts-node src/workers/webhookWorker.ts
```

---

## 🔧 Usage Example

### Add an Email Job
```bash
curl -X POST http://localhost:3000/api/email   -H "Content-Type: application/json"   -d '{
    "to": "user@example.com",
    "subject": "Hello",
    "body": "Welcome to BullMQ Jobs 🚀"
  }'
```

### Monitor Jobs
Visit 👉 [http://localhost:3000/admin/queues](http://localhost:3000/admin/queues)  
to see Bull Board in action.  

---

## 🤔 Why Use This?

- ✅ Preconfigured **BullMQ setup** → save hours of boilerplate work  
- ✅ Built-in workers for **Email, PDF, Webhooks**  
- ✅ Plug & play with any Node.js service  
- ✅ Scalable & production-ready (Redis + Docker)  

---

## 📜 License

MIT © [Queuelabs](https://github.com/queuelabs)
---
