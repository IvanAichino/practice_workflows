import { Router } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();
const healthController = new HealthController();

/**
 * @route GET /health
 * @desc Basic health check
 */
router.get('/', healthController.healthCheck);

/**
 * @route GET /health/detailed
 * @desc Detailed health check with dependencies
 */
router.get('/detailed', healthController.detailedHealthCheck);

export { router as healthRoutes };