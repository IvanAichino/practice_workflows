import request from 'supertest';
import express from 'express';
import { setupMiddleware } from '../../middleware';
import { setupRoutes } from '../../routes';

describe('API Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    setupMiddleware(app);
    setupRoutes(app);
  });

  describe('Root endpoint', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.status).toBe(200);
    });
  });

  describe('Health endpoints', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'healthy',
          version: '1.0.0',
        },
      });
    });

    it('should return detailed health status', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200);

      expect(response.body.data).toHaveProperty('dependencies');
      expect(response.body.data).toHaveProperty('system');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Route not found',
      });
    });
  });

  describe('Request validation', () => {
    it('should validate query parameters for feriados endpoint', async () => {
      await request(app)
        .get('/api/feriados?mes=13') // Invalid month
        .expect(400);
    });
  });
});