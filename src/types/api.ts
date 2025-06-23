/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message: string;
  readonly timestamp: string;
  readonly requestId?: string;
}

/**
 * Error response structure
 */
export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  readonly status: 'healthy' | 'unhealthy';
  readonly timestamp: string;
  readonly uptime: number;
  readonly version: string;
  readonly environment: string;
}