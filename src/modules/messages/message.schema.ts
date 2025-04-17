import { z } from 'zod';

export const sendMessageSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  content: z.string().min(1, 'Message content cannot be empty'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;