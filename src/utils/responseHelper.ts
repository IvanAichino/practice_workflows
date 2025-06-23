import { Response } from 'express';
import { ApiResponse } from '../types/api';

/**
 * Helper functions for standardized API responses
 */
export class ResponseHelper {
  /**
   * Send successful response
   */
  static success<T>(
    res: Response, 
    data: T, 
    message = 'Success', 
    statusCode = 200,
    requestId?: string
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }

  /**
   * Send error response
   */
  static error(
    res: Response, 
    message: string, 
    statusCode = 500,
    requestId?: string
  ): Response<ApiResponse<null>> {
    return res.status(statusCode).json({
      success: false,
      error: message,
      message: 'Error occurred',
      timestamp: new Date().toISOString(),
      requestId,
    });
  }

  /**
   * Send validation error response
   */
  static validationError(
    res: Response, 
    message: string,
    requestId?: string
  ): Response<ApiResponse<null>> {
    return this.error(res, message, 400, requestId);
  }

  /**
   * Send not found response
   */
  static notFound(
    res: Response, 
    message = 'Resource not found',
    requestId?: string
  ): Response<ApiResponse<null>> {
    return this.error(res, message, 404, requestId);
  }
}