import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

/**
 * Middleware to add unique request ID to each request
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  req.requestId = randomUUID();
  res.setHeader('X-Request-ID', req.requestId);
  next();
}