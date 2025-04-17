import rateLimit from 'express-rate-limit';
import logger from '../../shared/logger';

const isTest = process.env.NODE_ENV === 'test';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 100 : 1000,
  message: 'Too many requests, please try again later',
  handler: (req, res, next, options) => {
    logger.warn(`API rate limit exceeded: IP=${req.ip}`);
    res.status(options.statusCode).json({ message: options.message });
  },
});

export const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: 'Too many accounts created from this IP',
    handler: (req, res, next, options) => {
      logger.warn(`Signup rate limit exceeded: IP=${req.ip}`);
      res.status(options.statusCode).json({ message: options.message });
    },
  });

  export const messageLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: 'Too many messages, please slow down',
    handler: (req, res, next, options) => {
      logger.warn(`Message rate limit exceeded: IP=${req.ip}`);
      res.status(options.statusCode).json({ message: options.message });
    },
  });