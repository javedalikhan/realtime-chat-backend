# 📡 Realtime Chat Backend

A production-ready, scalable backend service for a realtime chat application. Built using **Node.js**, **TypeScript**, **Express**, **Socket.IO**, and **PostgreSQL**.

---

## ✨ Features

- 🚀 Real-time messaging with Socket.IO
- 🧾 REST API for user and message management
- 🧪 Integration tests with Jest and Supertest
- 🔒 In-memory rate limiting for abuse prevention
- 🛡 Error handling and validation
- 🌐 Swagger API documentation
- 🧵 Modular, maintainable TypeScript architecture
- 🐘 PostgreSQL

---

## 📦 Tech Stack

| Category         | Tech                                   |
|------------------|----------------------------------------|
| Language         | TypeScript                             |
| Framework        | Express.js                             |
| Realtime         | Socket.IO                              |
| Database         | PostgreSQL                             |
| API Docs         | Swagger                     |
| Testing          | Jest, Supertest                        |
| Rate Limiting    | express-rate-limit                     |
| Logging          | Morgan + Winston-based custom logger   |

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/javedalikhan/realtime-chat-backend
cd realtime-chat-backend
```
---
### 2. Install Dependencies
```bash
npm install
```
---
### 3. Add the `.env` file

Before running the server, create a `.env` file in the root directory of the project. You can do this by:

- **Copying the example file**:
  ```bash
  cp .env.example .env
  ```
- Or manually creating the .env file by copying the values from .env.example and filling in the required values, such as database credentials, port numbers, etc.
---
### 4. Run the server on localhost
```bash
npm run dev
```
---

### 5. Run Migrations
```bash
npm run migrate
## This will ensure you start from clean DB
```
---
### 6. Seed the Database
```bash
npm run seed
## This will generate a set of random users and messages in the database.
```
---
### 7. Run tests
```bash
npm run test
```
---
### 8. Frontend Repository
- If you're also looking to integrate the frontend for this chat application, you can find the frontend repository here: [Realtime Chat Frontend](https://github.com/javedalikhan/realtime-chat-frontend)
---
### 📚 API Documentation
```bash
http://localhost:3001/api-docs
```
---
### Project structure
```
realtime-chat-backend/
│
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── health.controller.ts
│   │   │   ├── message.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── __tests__/
│   │   │       └── message.controller.test.ts
│   │   │
│   │   ├── middlewares/
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiters.ts
│   │   │
│   │   └── routes/
│   │       ├── health.routes.ts
│   │       ├── message.routes.ts
│   │       ├── user.routes.ts
│   │       ├── index.ts
│   │       └── __tests__/
│   │           └── message.routes.test.ts
│   │
│   ├── modules/
│   │   ├── messages/
│   │   │   ├── message.schema.ts
│   │   │   ├── message.repository.ts
│   │   │   ├── message.service.ts
│   │   │   ├── message.types.ts
│   │   │   └── __tests__/
│   │   │       ├── message.repository.test.ts
│   │   │       └── message.service.test.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.repository.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.types.ts
│   │   │   └── __tests__/
│   │   │       ├── user.repository.test.ts
│   │   │       └── user.service.test.ts
│   │   │
│   │   └── socket/
│   │       └── socket.service.ts
│   │
│   ├── shared/
│   │   ├── config.ts
│   │   ├── db.ts
│   │   ├── logger.ts
│   │   ├── transaction.ts
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   ├── BadRequestError.ts
│   │   │   ├── InternalServerError.ts
│   │   │   └── index.ts
│   │   └── swagger/
│   │       ├── swagger.config.ts
│   │       └── swagger.setup.ts
│   │
│   ├── utils/
│   │   └── toCamelCase.ts
│   │
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # HTTP & Socket.IO server entry point
│   └── index.ts            # App initializer
│
├── scripts/
│   ├── migrate.ts
│   └── seed.ts
│
├── .env
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── docker-compose.yml
├── Dockerfile
├── jest.config.ts
├── package.json
└── tsconfig.json
```

### 🔒 Rate Limiting
```bash
	-	Global Limit: 1000 requests per 15 minutes
	-	Signup Limit: 5 requests per hour
	-	Message Limit: 60 requests per minute

### Rate limit violations are logged and return appropriate HTTP responses.
```
---

## 🚀 Possible Enhancements

Here are some potential features and improvements that can be explored in future iterations of this application:

- **Persistent Rate Limiting**: Replace the in-memory rate limiter with a distributed solution like Redis to handle rate limits across multiple instances.
- **Authentication & Authorization**: Integrate user authentication (JWT, OAuth) to support secure login and protected routes.
- **User Presence/Online Status**: Track and display users' online/offline status in real-time.
- **Typing Indicators**: Add "user is typing" indicators in the chat interface for better interactivity.
- **Message Delivery & Read Receipts**: Show whether messages were delivered and read by recipients.
- **Pagination & Infinite Scroll**: Add message pagination or infinite scroll to optimize chat history loading.
- **Monitoring & Logging**: Add Prometheus + Grafana or use a service like Sentry for enhanced observability.
- **Testing Enhancements**: Add more edge-case tests, load tests, and possibly contract tests between frontend and backend.
---

## License

This project is licensed under the MIT License.