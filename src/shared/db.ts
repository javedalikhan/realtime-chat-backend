import { Pool, PoolClient } from 'pg';
import { config } from './config';
import logger from './logger';

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
  max: 5, // Free tier allows 5 connections
});

export const initDb = async () => {
  try {
    await pool.connect();
    logger.info('Connected to the database');
  } catch (err) {
    logger.error('Failed to connect to the database', err);
    process.exit(1);
  }
};

pool.on('error', (err) => {
  logger.error('Unexpected error on idle DB client', err);
  process.exit(1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const getClient = async (): Promise<PoolClient> => {
  return pool.connect();
};

export const gracefulShutdown = async () => {
  logger.info('📦 Closing DB pool...');
  await pool.end();
  logger.info('DB pool closed');
};

export type { PoolClient };
