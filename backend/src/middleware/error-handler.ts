import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { logger } from '../utils/logger';

type ErrorWithStatus = Error & { status?: number; statusCode?: number };

export const notFoundHandler = (_: Request, __: Response, next: NextFunction) => {
  next(createHttpError(404, 'Resource not found'));
};

export const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || err.statusCode || 500;
  const payload = {
    status,
    message: err.message || 'Something went wrong',
  };

  if (status >= 500) {
    logger.error({ err }, 'Unhandled server error');
  }

  res.status(status).json(payload);
};
