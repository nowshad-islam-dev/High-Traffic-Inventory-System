import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  } else {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
