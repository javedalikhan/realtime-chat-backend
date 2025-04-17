import { Router } from 'express';
import asynchHandler from 'express-async-handler';
import { createMessage, getMessages } from '../controllers/message.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Messages
 *     description: Chat message operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         username:
 *           type: string
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateMessageRequest:
 *       type: object
 *       required:
 *         - username
 *         - content
 *       properties:
 *         username:
 *           type: string
 *           example: test_user
 *         content:
 *           type: string
 *           example: Hello world!
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get recent messages
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.get('/', asynchHandler(getMessages));

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMessageRequest'
 *     responses:
 *       201:
 *         description: Message created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input
 */
router.post('/', asynchHandler(createMessage));

export default router;