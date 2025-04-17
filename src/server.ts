import { Server } from 'socket.io';
import { createApp } from './app';
import { initSocket } from './modules/socket/socket.service';
import { config } from './shared/config';
import { gracefulShutdown } from './shared/db';
import logger from './shared/logger';


const app = createApp();

export const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  logger.info('👋 Gracefully shutting down...');
  await gracefulShutdown();
  process.exit(0);
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? config.frontendUrl : "*",
    methods: ["GET", "POST"]
  }
});
// Initialize Socket.io logic
initSocket(io);