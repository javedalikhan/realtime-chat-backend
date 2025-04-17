import { Request, Response } from 'express';
import { sendMessageSchema } from '../../../modules/messages/message.schema';
import * as messageService from '../../../modules/messages/message.service';
import { createMessage, getMessages } from '../message.controller';

jest.mock('../../../modules/messages/message.service');
jest.mock('../../../modules/messages/message.schema', () => ({
  sendMessageSchema: {
    parse: jest.fn()
  }
}));

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Message Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMessages', () => {
    it('should return messages with status 200', async () => {
      const req = {} as Request;
      const res = mockResponse();
      const mockMessages = [{ id: '1', username: 'test', content: 'Hi' }];

      (messageService.getRecentMessages as jest.Mock).mockResolvedValue(mockMessages);

      await getMessages(req, res);

      expect(messageService.getRecentMessages).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMessages);
    });
  });

  describe('createMessage', () => {
    it('should create a message and return 201', async () => {
      const req = {
        body: { username: 'user1', content: 'Hello!' }
      } as Request;
      const res = mockResponse();

      (sendMessageSchema.parse as jest.Mock).mockReturnValue(req.body);
      (messageService.sendMessage as jest.Mock).mockResolvedValue({
        id: '2',
        username: 'user1',
        content: 'Hello!'
      });

      await createMessage(req, res);

      expect(sendMessageSchema.parse).toHaveBeenCalledWith(req.body);
      expect(messageService.sendMessage).toHaveBeenCalledWith('user1', 'Hello!');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: '2',
        username: 'user1',
        content: 'Hello!'
      });
    });

    it('should return 400 if validation fails', async () => {
      const req = {
        body: { username: '', content: '' }
      } as Request;
      const res = mockResponse();

      (sendMessageSchema.parse as jest.Mock).mockImplementation(() => {
        throw new Error('Validation failed');
      });

      await createMessage(req, res);

      expect(sendMessageSchema.parse).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Validation failed' });
    });
  });
});