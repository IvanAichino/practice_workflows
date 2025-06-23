import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from '../config/config';
import { requestIdMiddleware } from '../utils/requestId';
import { loggingMiddleware } from './logging';

/**
 * Setup all application middleware
 */
export function setupMiddleware(app: Application): void {
  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(cors({
    origin: config.nodeEnv === 'production' ? false : true,
    credentials: true,
  }));

  // Request parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Serve static files from public directory
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Request ID middleware
  app.use(requestIdMiddleware);

  // Logging middleware
  app.use(loggingMiddleware);

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      message: 'Rate limit exceeded',
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(limiter);
}