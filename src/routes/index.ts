import { Application } from 'express';
import path from 'path';
import { feriadosRoutes } from './feriados';
import { healthRoutes } from './health';

/**
 * Setup all application routes
 */
export function setupRoutes(app: Application): void {
  // API routes
  app.use('/api/feriados', feriadosRoutes);
  
  // Health check routes
  app.use('/health', healthRoutes);

  // Root endpoint - serve static HTML page
  app.get('/', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });

  // API info endpoint
  app.get('/api', (_req, res) => {
    res.json({
      success: true,
      message: 'TypeScript REST API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      documentation: '/',
      endpoints: {
        feriados: '/api/feriados',
        stats: '/api/feriados/stats',
        health: '/health',
        detailedHealth: '/health/detailed'
      }
    });
  });

  // 404 handler for unknown routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      message: 'The requested endpoint does not exist',
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
  });
}