import { PoolClient, pool } from '../../shared/db';
import { toCamel } from '../../utils/toCamelCase';
import { DbUser, User } from './user.types';

export const findOrCreateUser = async (
  username: string,
  client?: PoolClient
): Promise<User> => {
  const executer = client || pool;
  const { rows } = await executer.query<DbUser>(
    `INSERT INTO users (username) 
     VALUES ($1)
     ON CONFLICT (username) DO UPDATE
     SET username = EXCLUDED.username
     RETURNING id, username, created_at`,
    [username]
  );
  return toCamel(rows[0]) as User;
};

export const getUserById = async (
  userId: string,
  client?: PoolClient
): Promise<User | null> => {
  const executor = client || pool;
  const { rows } = await executor.query(
    `SELECT id, username, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  );
  return toCamel(rows[0]) as User || null;
};