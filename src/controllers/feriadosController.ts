import { Request, Response, NextFunction } from 'express';
import { FeriadosService } from '../services/feriadosService';
import { FeriadosQuery } from '../types/feriado';
import { ResponseHelper } from '../utils/responseHelper';
import { logger } from '../config/logger';

/**
 * Controller for holidays endpoints
 */
export class FeriadosController {
  private readonly feriadosService: FeriadosService;

  constructor() {
    this.feriadosService = new FeriadosService();
  }

  /**
   * Get all holidays with optional filtering
   * GET /api/feriados?mes=1&tipo=feriado
   */
  getFeriados = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { mes, tipo } = req.query;
      const query: FeriadosQuery = {};

      if (typeof mes === 'string' && mes) {
        query.mes = mes;
      }

      if (typeof tipo === 'string' && tipo) {
        query.tipo = tipo;
      }

      logger.info('Processing request for holidays', {
        requestId: req.requestId,
        query,
      });

      const feriados = await this.feriadosService.getFeriados(query, req.requestId);

      ResponseHelper.success(
        res,
        feriados,
        `Found ${feriados.length} holidays`,
        200,
        req.requestId
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get holidays statistics
   * GET /api/feriados/stats
   */
  getFeriadosStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Processing request for holidays statistics', {
        requestId: req.requestId,
      });

      const stats = await this.feriadosService.getFeriadosStats(req.requestId);

      ResponseHelper.success(
        res,
        stats,
        'Statistics retrieved successfully',
        200,
        req.requestId
      );
    } catch (error) {
      next(error);
    }
  };
}