import { Request, Response } from 'express';
import { HealthCheckResponse } from '../types/api';
import { config } from '../config/config';
import { ResponseHelper } from '../utils/responseHelper';

/**
 * Controller for health check endpoints
 */
export class HealthController {
  /**
   * Health check endpoint
   * GET /health
   */
  healthCheck = (req: Request, res: Response): void => {
    const healthData: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: config.nodeEnv,
    };

    ResponseHelper.success(
      res,
      healthData,
      'Service is healthy',
      200,
      req.requestId
    );
  };

  /**
   * Detailed health check with dependencies
   * GET /health/detailed
   */
  detailedHealthCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        environment: config.nodeEnv,
        dependencies: {
          argentinaDataApi: {
            status: 'unknown',
            url: config.argentinaDataApiUrl,
          },
        },
        system: {
          memory: process.memoryUsage(),
          platform: process.platform,
          nodeVersion: process.version,
        },
      };

      // Test external API connectivity (optional quick check)
      try {
        const axios = await import('axios');
        await axios.default.get(`${config.argentinaDataApiUrl}/feriados/2025`, {
          timeout: 5000,
        });
        healthData.dependencies.argentinaDataApi.status = 'healthy';
      } catch {
        healthData.dependencies.argentinaDataApi.status = 'unhealthy';
      }

      ResponseHelper.success(
        res,
        healthData,
        'Detailed health check completed',
        200,
        req.requestId
      );
    } catch (error) {
      ResponseHelper.error(
        res,
        'Health check failed',
        503,
        req.requestId
      );
    }
  };
}