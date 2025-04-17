import compression from 'compression';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './api/middlewares/errorHandler';
import { globalLimiter, messageLimiter, signupLimiter } from './api/middlewares/rateLimiters';
import healthRouter from './api/routes/health.routes';
import messageRouter from './api/routes/message.routes';
import userRouter from './api/routes/user.routes';
import { config } from './shared/config';
import logger from './shared/logger';
import { swaggerServe, swaggerSetup } from './shared/swagger';

export const createApp = () => {
  const app = express();
  app.use(compression()); 
  app.use(cors(
    {
    origin: process.env.NODE_ENV === 'production' ? config.frontendUrl : "*",
    methods: ["GET", "POST"]
    }
  ));
  app.use(express.json());

  // Apply rate limits
  app.use(globalLimiter); // Applies to all routes
  app.use('/api/users', signupLimiter); // Stricter signup limit
  app.use('/api/messages', messageLimiter); // Message-specific limit


  // Routes
   app.use('/health', healthRouter);
   app.use('/api/messages', messageRouter);
   app.use('/api/users', userRouter);
 

  // Middlewares
  app.use('/api-docs', swaggerServe, swaggerSetup);
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
  
   // 404 handler
   app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};