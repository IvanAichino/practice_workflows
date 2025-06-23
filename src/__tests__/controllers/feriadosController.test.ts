import request from 'supertest';
import express from 'express';
import { FeriadosController } from '../../controllers/feriadosController';
import { FeriadosService } from '../../services/feriadosService';
import { setupMiddleware } from '../../middleware';

// Mock the service
jest.mock('../../services/feriadosService');
const MockedFeriadosService = FeriadosService as jest.MockedClass<typeof FeriadosService>;

describe('FeriadosController', () => {
  let app: express.Application;
  let mockFeriadosService: jest.Mocked<FeriadosService>;

  beforeEach(() => {
    app = express();
    setupMiddleware(app);

    mockFeriadosService = new MockedFeriadosService() as jest.Mocked<FeriadosService>;
    const controller = new FeriadosController();
    // Replace the service instance with our mock
    (controller as any).feriadosService = mockFeriadosService;

    app.get('/feriados', controller.getFeriados);
    app.get('/feriados/stats', controller.getFeriadosStats);
  });

  describe('GET /feriados', () => {
    it('should return holidays successfully', async () => {
      const mockFeriados = [
        {
          id: '1',
          motivo: 'Año Nuevo',
          tipo: 'feriado',
          fecha: '2025-01-01',
          diaSemana: 'Miércoles',
          mes: 'Enero',
          esTraslado: false,
        },
      ];

      mockFeriadosService.getFeriados.mockResolvedValue(mockFeriados);

      const response = await request(app)
        .get('/feriados')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: mockFeriados,
        message: expect.stringContaining('Found 1 holidays'),
      });
    });

    it('should handle query parameters', async () => {
      mockFeriadosService.getFeriados.mockResolvedValue([]);

      await request(app)
        .get('/feriados?mes=1&tipo=feriado')
        .expect(200);

      expect(mockFeriadosService.getFeriados).toHaveBeenCalledWith(
        { mes: '1', tipo: 'feriado' },
        expect.any(String)
      );
    });

    it('should handle service errors', async () => {
      mockFeriadosService.getFeriados.mockRejectedValue(new Error('Service error'));

      await request(app)
        .get('/feriados')
        .expect(500);
    });
  });

  describe('GET /feriados/stats', () => {
    it('should return statistics successfully', async () => {
      const mockStats = {
        total: 10,
        porTipo: { 'feriado': 8, 'día no laborable': 2 },
        porMes: { 'Enero': 1, 'Mayo': 1 },
        traslados: 2,
      };

      mockFeriadosService.getFeriadosStats.mockResolvedValue(mockStats);

      const response = await request(app)
        .get('/feriados/stats')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: mockStats,
        message: 'Statistics retrieved successfully',
      });
    });
  });
});