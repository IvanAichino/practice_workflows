import winston from 'winston';
import { config } from './config';

/**
 * Custom log format for development (pretty printing)
 */
const prettyFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

/**
 * JSON format for production
 */
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Centralized logger instance
 * Supports both pretty printing for development and structured JSON for production
 */
export const logger = winston.createLogger({
  level: config.logging.level,
  format: config.logging.format === 'pretty' ? prettyFormat : jsonFormat,
  defaultMeta: {
    service: 'typescript-rest-api',
    environment: config.nodeEnv,
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      format: jsonFormat 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      format: jsonFormat 
    }),
  ],
});

// Create logs directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
  mkdirSync('logs', { recursive: true });
} catch (error) {
  // Directory might already exist
}