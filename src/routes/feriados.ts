import { Router } from 'express';
import { FeriadosController } from '../controllers/feriadosController';
import { validateRequest, validationSchemas } from '../middleware/validation';

const router = Router();
const feriadosController = new FeriadosController();

/**
 * @route GET /api/feriados
 * @desc Get all holidays with optional filtering
 * @query mes - Filter by month (1-12)
 * @query tipo - Filter by holiday type
 */
router.get(
  '/',
  validateRequest({ query: validationSchemas.feriadosQuery }),
  feriadosController.getFeriados
);

/**
 * @route GET /api/feriados/stats
 * @desc Get holidays statistics
 */
router.get('/stats', feriadosController.getFeriadosStats);

export { router as feriadosRoutes };