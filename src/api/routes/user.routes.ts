import { Router } from "express";
import asyncHandler from "express-async-handler";
import { createUser, getCurrentUser } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         username:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - username
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           example: new_user
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid username
 */

// Route to create a new user
router.post("/", asyncHandler(createUser));

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
// Route to get the current user by ID
router.get("/:userId", asyncHandler(getCurrentUser));

export default router;