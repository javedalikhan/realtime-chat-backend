import { pool, PoolClient } from '../../shared/db';
import { toCamel, toCamelArray } from '../../utils/toCamelCase';
import { DbMessage, Message } from './message.types';

export const createMessage = async (
  userId: string,
  content: string,
  client?: PoolClient
): Promise<Message> => {
  const executor = client || pool;

  const { rows } = await executor.query<DbMessage>(
    `INSERT INTO messages (user_id, content) 
     VALUES ($1, $2)
     RETURNING id, user_id, content, created_at`,
    [userId, content]
  );

  const userRes = await executor.query<{ username: string }>(
    `SELECT username FROM users WHERE id = $1`,
    [userId]
  );

  return toCamel({
    ...rows[0],
    username: userRes.rows[0].username,
  }) as Message;
};

export const getMessages = async (
  limit: number = 50,
  client?: PoolClient
): Promise<Message[]> => {
  const executor = client || pool;

  const { rows } = await executor.query<DbMessage>(
    `SELECT m.id, m.user_id, m.content, m.created_at, u.username
     FROM messages m
     JOIN users u ON m.user_id = u.id
     ORDER BY m.created_at DESC
     LIMIT $1`,
    [limit]
  );

  return toCamelArray(rows) as Message[];
};