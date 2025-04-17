import { pool, PoolClient } from './db';
import { InternalServerError } from './errors';
import logger from './logger';

export const runInTransaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client: PoolClient = await pool.connect();
  
  try {
    logger.debug('Starting transaction');
    await client.query('BEGIN');

    const result = await callback(client);

    await client.query('COMMIT');
    logger.debug('Transaction committed');

    return result;
  } catch (err) {
    logger.error('Transaction failed, rolling back...', err);
    try {
      await client.query('ROLLBACK');
      logger.debug('Rollback successful');
    } catch (rollbackErr) {
      logger.error('Rollback failed!', rollbackErr);
    }

    throw new InternalServerError('Transaction failed');
  } finally {
    client.release();
    logger.debug('Client connection released');
  }
};