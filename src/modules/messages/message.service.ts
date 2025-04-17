import logger from '../../shared/logger';
import { runInTransaction } from '../../shared/transaction';
import { findOrCreateUser } from '../users/user.service';
import { createMessage, getMessages } from './message.repository';
import { Message } from './message.types';

export const getRecentMessages = async (limit: number = 50): Promise<Message[]> => {
  try {
    return await getMessages(limit);
  } catch (error) {
    logger.error(`Failed to get messages: ${error}`);
    throw new Error("Failed to retrieve messages");
  }
};

export const sendMessage = async (
  username: string,
  content: string
): Promise<Message> => {
  if (!content.trim()) throw new Error("Message content cannot be empty");

  return runInTransaction(async (client) => {
    try {
      const user = await findOrCreateUser(username);
      const message = await createMessage(user.id, content, client);
      return { ...message, username: user.username };
    } catch (error) {
      logger.error(`Failed to send message: ${error}`);
      throw new Error("Failed to send message");
    }
  });
};