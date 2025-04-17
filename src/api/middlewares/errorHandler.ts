import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../shared/errors';
import logger from '../../shared/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isAppError = err instanceof AppError;

  // Log the error in all cases
  logger.error('Error occurred:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    originalError: isAppError ? err.originalError : undefined,
  });

  const statusCode = isAppError ? err.statusCode : 500;
  const message =
    process.env.NODE_ENV === 'production' && !isAppError
      ? 'Internal server error'
      : err.message;

  res.status(statusCode).json({ error: message });
}