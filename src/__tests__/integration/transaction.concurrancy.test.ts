import { Application } from 'express';
import { Server } from 'http';
import request from 'supertest';
import { createApp } from '../../app';
import { pool } from '../../shared/db';

describe('Transaction Concurrency', () => {
  let app: Application;
  let server: Server;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(0);
    await pool.query('TRUNCATE users, messages CASCADE');
  }, 15000);

  afterAll(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve)); // Ensure server shuts down
    }
  
    // Check if pool is still active
    try {
      await pool.end(); // Closes all connections
    } catch (err) {
      console.warn('Failed to close DB pool', err);
    }
  
    // Let Jest flush any remaining timers or open handles
    await new Promise(resolve => setImmediate(resolve));
  }, 30000);

  it('should handle concurrent requests and insert correct number of messages', async () => {
    const totalRequests = 4; // Number of concurrent requests - doesn't work with more than 4 on NeonDB

    const responses = await Promise.all(
      Array(totalRequests).fill(0).map(() =>
        request(server)
          .post('/api/messages')
          .send({ username: 'test_user', content: 'Hello world' })
      )
    );

    // All should succeed
    responses.forEach(res => expect(res.status).toBe(201));

    // Now query the DB to ensure all messages are inserted
    const result = await pool.query(
        `SELECT COUNT(*) FROM messages 
         WHERE user_id = (
           SELECT id FROM users WHERE username = $1
         )`,
        ['test_user']
      );
    const messageCount = parseInt(result.rows[0].count, 10);

    expect(messageCount).toBe(totalRequests);
  }, 30000);

  it('should allow only one insert for duplicate usernames', async () => {
    const makeRequest = () =>
      request(server)
        .post('/api/users')
        .send({ username: 'duplicate_username' });
  
    const [res1, res2] = await Promise.all([makeRequest(), makeRequest()]);
  
    const statuses = [res1.status, res2.status].sort();
  
    const result = await pool.query('SELECT COUNT(*) FROM users WHERE username = $1', ['duplicate_username']);
    expect(parseInt(result.rows[0].count)).toBe(1);
  });

});