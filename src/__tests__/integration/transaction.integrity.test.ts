import { Application } from 'express';
import request from 'supertest';
import { createApp } from '../../app';
import { pool } from '../../shared/db';

describe('Transaction Integrity', () => {
    let app: Express.Application;

    beforeAll(async () => {
      app = createApp();
      await pool.query('TRUNCATE messages, users CASCADE');
    });
  
    afterAll(async () => {
      await pool.end();
    });
    it('should rollback entire transaction when message creation fails', async () => {
        // 1. First verify empty DB
        const emptyUsers = await pool.query('SELECT * FROM users');
        const emptyMessages = await pool.query('SELECT * FROM messages');
        expect(emptyUsers.rows.length).toBe(0);
        expect(emptyMessages.rows.length).toBe(0);
      
        // 2. Attempt to create invalid message
        try {
          await request(app as Application)
            .post('/api/messages')
            .send({ 
              username: 'testuser',
              content: '' // This should trigger your validation error
            });
          fail('Request should have failed');
        } catch (e) {
          // Expected error
        }
      
        // 3. Verify NO data was persisted (complete rollback)
        const usersAfter = await pool.query('SELECT * FROM users');
        const messagesAfter = await pool.query('SELECT * FROM messages');
        expect(usersAfter.rows.length).toBe(0); // User creation should be rolled back too
        expect(messagesAfter.rows.length).toBe(0);
      });
});