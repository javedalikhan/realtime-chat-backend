import logger from '../../../shared/logger';
import { runInTransaction } from '../../../shared/transaction';
import { findOrCreateUser } from '../../users/user.service';
import { createMessage, getMessages } from '../message.repository';
import { getRecentMessages, sendMessage } from '../message.service';

jest.mock('../../../shared/logger');
jest.mock('../../../shared/transaction');
jest.mock('../../users/user.service');
jest.mock('../message.repository');

const mockMessage = {
  id: '1',
  content: 'Test message',
  userId: 'user1',
  createdAt: new Date(),
  username: 'testuser'
};

describe('Message Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default successful mocks
    (getMessages as jest.Mock).mockResolvedValue([mockMessage]);
    (findOrCreateUser as jest.Mock).mockResolvedValue({ 
      id: 'user1', 
      username: 'testuser' 
    });
    (createMessage as jest.Mock).mockResolvedValue(mockMessage);
    
    // Realistic transaction mock that preserves error handling
    (runInTransaction as jest.Mock).mockImplementation(async (cb) => {
      const mockClient = { id: 'tx-123' }; // Mock transaction client
      try {
        return await cb(mockClient);
      } catch (error) {
        throw error;
      }
    });
  });

  describe('getRecentMessages', () => {
    it('should retrieve messages with default limit', async () => {
      const messages = await getRecentMessages();
      expect(getMessages).toHaveBeenCalledWith(50);
      expect(messages).toEqual([mockMessage]);
    });

    it('should log and rethrow errors', async () => {
      const dbError = new Error('DB error');
      (getMessages as jest.Mock).mockRejectedValue(dbError);
      await expect(getRecentMessages()).rejects.toThrow('Failed to retrieve messages');
      expect(logger.error).toHaveBeenCalledWith(
        `Failed to get messages: ${dbError}`
      );
    });
  });

  describe('sendMessage', () => {
    it('should create message in transaction', async () => {
      const result = await sendMessage('testuser', 'Hello');
      
      expect(runInTransaction).toHaveBeenCalled();
      expect(findOrCreateUser).toHaveBeenCalledWith('testuser');
      expect(createMessage).toHaveBeenCalledWith(
        'user1', 
        'Hello',
        expect.objectContaining({ id: 'tx-123' })
      );
      expect(result).toEqual(mockMessage);
    });

    it('should reject empty content', async () => {
      await expect(sendMessage('testuser', '   ')).rejects.toThrow(
        'Message content cannot be empty'
      );
    });

    it('should handle message creation failures', async () => {
      const dbError = new Error('DB write failed');
      (createMessage as jest.Mock).mockRejectedValue(dbError);
      
      await expect(sendMessage('testuser', 'Hello')).rejects.toThrow(
        'Failed to send message'
      );
      expect(logger.error).toHaveBeenCalledWith(
        `Failed to send message: ${dbError}`
      );
    });

    it('should include username in response', async () => {
      const result = await sendMessage('testuser', 'Hello');
      expect(result.username).toBe('testuser');
    });
  });
});