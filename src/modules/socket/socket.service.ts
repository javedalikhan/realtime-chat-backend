import { Server, Socket } from 'socket.io';
import logger from '../../shared/logger';
import { sendMessageSchema } from '../messages/message.schema';
import { sendMessage } from '../messages/message.service';


export const initSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        logger.info(`Socket connected: ${socket.id}`);

        socket.on('join', (userId: string) => {
            socket.join(userId);
            logger.info(`User ${userId} joined socket room`);
        });
        
        socket.on('disconnect', () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });

        socket.on('error', (error) => {
            logger.error(`Socket error: ${error}`);
        });

        socket.on('sendMessage', async (payload) => {
            try {
              const validated = sendMessageSchema.parse(payload);
          
              const message = await sendMessage(
                validated.username,
                validated.content
              );
          
              io.emit('newMessage', {
                ...message,
                username: validated.username,
              });
          
              socket.emit('messageDelivered', message.id);
              logger.info(`Message sent: ${JSON.stringify(message)}`);
            } catch (error) {
              logger.error('Socket message error:', error);
          
              socket.emit('error', {
                event: 'sendMessage',
                message: error instanceof Error ? error.message : 'Invalid message payload',
              });
            }
          });
    });
}