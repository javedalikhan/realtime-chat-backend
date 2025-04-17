import { pool } from '../../../shared/db';
import { toCamel, toCamelArray } from '../../../utils/toCamelCase';
import { createMessage, getMessages } from '../message.repository';

jest.mock('../../../shared/db', () => ({
  pool: { query: jest.fn() }
}));

jest.mock('../../../utils/toCamelCase', () => ({
  toCamel: jest.fn(),
  toCamelArray: jest.fn()
}));

describe('message.repository', () => {
  const mockMessageRow = {
    id: '1',
    user_id: 'user1',
    content: 'Hello',
    created_at: new Date()
  };

  const mockUserRow = { username: 'john doe' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMessage', () => {
    it('should insert message and return camelCased result', async () => {
      // Simulate INSERT returning message row
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockMessageRow] }) // INSERT INTO messages...
        .mockResolvedValueOnce({ rows: [mockUserRow] });   // SELECT username FROM users...

      const camelCased = { ...mockMessageRow, username: 'john doe' };
      (toCamel as jest.Mock).mockReturnValue(camelCased);

      const result = await createMessage('user1', 'Hello');

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('INSERT INTO messages'),
        ['user1', 'Hello']
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('SELECT username FROM users'),
        ['user1']
      );

      expect(toCamel).toHaveBeenCalledWith({
        ...mockMessageRow,
        username: 'john doe'
      });

      expect(result).toEqual(camelCased);
    });
  });

  describe('getMessages', () => {
    it('should fetch recent messages with limit and return camelCased array', async () => {
      const rows = [
        { id: '1', user_id: 'user1', content: 'msg 1', created_at: new Date(), username: 'john' },
        { id: '2', user_id: 'user2', content: 'msg 2', created_at: new Date(), username: 'alice' }
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows });
      const camelMessages = [
        { id: '1', userId: 'user1', content: 'msg 1', username: 'john' },
        { id: '2', userId: 'user2', content: 'msg 2', username: 'alice' }
      ];
      (toCamelArray as jest.Mock).mockReturnValue(camelMessages);

      const result = await getMessages(10);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT m.id, m.user_id'),
        [10]
      );
      expect(toCamelArray).toHaveBeenCalledWith(rows);
      expect(result).toEqual(camelMessages);
    });
  });
});