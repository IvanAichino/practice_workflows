import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  readonly port: number;
  readonly nodeEnv: string;
  readonly argentinaDataApiUrl: string;
  readonly logging: {
    readonly level: string;
    readonly format: 'json' | 'pretty';
  };
  readonly rateLimit: {
    readonly windowMs: number;
    readonly maxRequests: number;
  };
}

/**
 * Application configuration object
 * Centralizes all environment variables and configuration
 */
export const config: Config = {
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  argentinaDataApiUrl: process.env['ARGENTINA_DATOS_API_URL'] ?? 'https://api.argentinadatos.com/v1',
  logging: {
    level: process.env['LOG_LEVEL'] ?? 'info',
    format: (process.env['LOG_FORMAT'] as 'json' | 'pretty') ?? 'json',
  },
  rateLimit: {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] ?? '900000', 10),
    maxRequests: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] ?? '100', 10),
  },
};

/**
 * Validate configuration on startup
 */
export function validateConfig(): void {
  const requiredEnvVars = ['ARGENTINA_DATOS_API_URL'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  if (config.port < 1 || config.port > 65535) {
    throw new Error('PORT must be between 1 and 65535');
  }
}