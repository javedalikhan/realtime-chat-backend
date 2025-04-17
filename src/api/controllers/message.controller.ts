import { Request, Response } from "express";
import { sendMessageSchema } from "../../modules/messages/message.schema";
import * as messageService from "../../modules/messages/message.service";


// This function handles the retrieval of recent messages
export const getMessages = async (req: Request, res: Response) => {
  const messages = await messageService.getRecentMessages();
  res.status(200).json(messages);
}

// This function handles the creation of a new message
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { username, content } = sendMessageSchema.parse(req.body);
    const message = await messageService.sendMessage(username, content);
    res.status(201).json(message);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(400).json({ message: 'Invalid input' });
  }
};