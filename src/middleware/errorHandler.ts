import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ResponseHelper } from '../utils/responseHelper';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Global error handling middleware
 * Must be the last middleware in the chain
 */
export function errorHandler(
  err: Error, 
  req: Request, 
  res: Response, 
  _next: NextFunction
): void {
  logger.error('Error occurred', {
    requestId: req.requestId,
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  if (err instanceof ApiError) {
    ResponseHelper.error(res, err.message, err.statusCode, req.requestId);
    return;
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    ResponseHelper.validationError(res, err.message, req.requestId);
    return;
  }

  if (err.name === 'CastError') {
    ResponseHelper.validationError(res, 'Invalid parameter format', req.requestId);
    return;
  }

  // Default server error
  ResponseHelper.error(
    res, 
    'Internal server error', 
    500, 
    req.requestId
  );
}