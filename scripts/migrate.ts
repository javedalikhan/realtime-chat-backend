import { query } from "../src/shared/db";
import logger from '../src/shared/logger';

const setupDatabase = async () => {
  try {
    await query(`BEGIN`);

    // Drop tables if they exist 
    await query(`DROP TABLE IF EXISTS messages`);
    await query(`DROP TABLE IF EXISTS users`);

  
    await query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await query(`
      CREATE TABLE messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Performance indexes
    await query(`CREATE INDEX idx_messages_user_id ON messages(user_id);`);
    await query(`CREATE INDEX idx_messages_created_at ON messages(created_at);`);

    await query(`COMMIT`);
    logger.info('Database tables created with proper timezone support');
  } catch (error) {
    await query(`ROLLBACK`);
    logger.error('Database setup failed', error);
    throw error;
  }
};

setupDatabase().catch(() => process.exit(1));