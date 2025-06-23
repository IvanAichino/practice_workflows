import express from 'express';
import { config } from './config/config';
import { logger } from './config/logger';
import { setupMiddleware } from './middleware';
import { setupRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';

/**
 * Bootstrap and start the Express server
 */
async function startServer(): Promise<void> {
  try {
    const app = express();

    // Setup middleware
    setupMiddleware(app);

    // Setup routes
    setupRoutes(app);

    // Error handling middleware (must be last)
    app.use(errorHandler);

    // Start server
    app.listen(config.port, () => {
      logger.info('Server started successfully', {
        port: config.port,
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection', { reason });
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Start the server
void startServer();