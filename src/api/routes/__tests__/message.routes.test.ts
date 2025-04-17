import express from 'express';
import request from 'supertest';
import * as controller from '../../controllers/message.controller';
import router from '../message.routes';

const app = express();
app.use(express.json());
app.use('/api/messages', router);

// Mock controller functions
jest.mock('../../controllers/message.controller', () => ({
  getMessages: jest.fn(),
  createMessage: jest.fn()
}));

describe('Message Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/messages', () => {
    it('should call getMessages controller', async () => {
      const mockFn = controller.getMessages as jest.Mock;
      mockFn.mockImplementation((req, res) => {
        return res.status(200).json([{ id: '1', username: 'test', content: 'Hi' }]);
      });

      const response = await request(app).get('/api/messages');

      expect(mockFn).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: '1', username: 'test', content: 'Hi' }]);
    });
  });

  describe('POST /api/messages', () => {
    it('should call createMessage controller', async () => {
      const mockFn = controller.createMessage as jest.Mock;
      mockFn.mockImplementation((req, res) => {
        return res.status(201).json({ id: '2', username: 'user1', content: 'Hello world!' });
      });

      const response = await request(app)
        .post('/api/messages')
        .send({ username: 'user1', content: 'Hello world!' });

      expect(mockFn).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: '2', username: 'user1', content: 'Hello world!' });
    });
  });
});