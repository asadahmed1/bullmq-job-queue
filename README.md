# 📬 BullMQ Job Queue Microservice (Email Queue)

A production-ready Node.js microservice for background job processing using BullMQ, Redis, and Express. This service queues and processes email jobs and includes an admin dashboard via Bull Board.

---

## 🚀 Features

- 📥 Add jobs via REST API
- 📤 Email worker using Nodemailer
- 🖥️ Bull Board Admin UI (`/admin/queues`)
- ✅ Input validation with Joi
- 🧱 Redis-backed job queue (via BullMQ)
- 🐳 Docker-ready for local or cloud deployment

---

## 🧰 Tech Stack

- Node.js
- Express
- BullMQ
- Redis
- Nodemailer
- Bull Board
- TypeScript

---

## 📦 Project Structure

job-queue-service/
├── src/
│ ├── queues/ # Job queues (e.g., emailQueue.ts)
│ ├── workers/ # Job processors (e.g., emailWorker.ts)
│ ├── routes/ # Express API routes
│ ├── app.ts # Express app setup
│ └── server.ts # Entry point
├── .env
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md

yaml
Copy
Edit

---

## 🛠️ Prerequisites

- Node.js `v18+`
- Redis (locally or via Docker)
- Docker (optional but recommended)
- Gmail (or Mailtrap) for email testing

---

## 📥 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/job-queue-service.git
cd job-queue-service
npm install
docker run -d --name redis-server -p 6379:6379 redis
npx ts-node src/server.ts
npx ts-node src/workers/emailWorker.ts
npx ts-node src/workers/pdfWorker.ts
npx ts-node src/workers/webhookWorker.ts
```
