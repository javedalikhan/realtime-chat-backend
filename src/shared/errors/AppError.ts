export class AppError extends Error {
    constructor(
      public message: string,
      public statusCode: number = 500,
      public originalError?: unknown
    ) {
      super(message);
      this.statusCode = statusCode;
      this.originalError = originalError;
      Error.captureStackTrace(this, this.constructor);
    }
  }