import { Request, Response } from 'express';
import { findOrCreateUser, getUserById } from '../../modules/users/user.service';
import { BadRequestError } from '../../shared/errors';

// This function retrieves the current user based on the userId parameter
export const getCurrentUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) throw new BadRequestError('User ID required');

  const user = await getUserById(userId);
  if (!user) throw new BadRequestError('User not found');

  res.status(200).json(user);
};


  // This function creates a new user or retrieves an existing one
  export const createUser = async (req: Request, res: Response) => {
    const { username } = req.body;
    const user = await findOrCreateUser(username.trim().toLowerCase());
    res.status(201).json(user);
  };