import axios from 'axios';
import { FeriadosService } from '../../services/feriadosService';
import { FeriadoApiResponse } from '../../types/feriado';
import { ApiError } from '../../middleware/errorHandler';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FeriadosService', () => {
  let feriadosService: FeriadosService;

  beforeEach(() => {
    feriadosService = new FeriadosService();
    jest.clearAllMocks();
  });

  const mockApiResponse: FeriadoApiResponse[] = [
    {
      motivo: 'Año Nuevo',
      tipo: 'feriado',
      fecha: '01-01-2025',
    },
    {
      motivo: 'Día del Trabajador',
      tipo: 'feriado',
      fecha: '05-01-2025',
    },
    {
      motivo: 'Carnaval',
      tipo: 'feriado',
      fecha: '03-03-2025',
      fechaOriginal: '03-01-2025',
    },
  ];

  describe('getFeriados', () => {
    it('should fetch and process holidays successfully', async () => {
      mockedAxios.get.mockResolvedValue({
        data: mockApiResponse,
        status: 200,
      });

      const result = await feriadosService.getFeriados();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/feriados/2025'),
        expect.objectContaining({
          timeout: 10000,
          maxRedirects: 5,
        })
      );

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        motivo: 'Año Nuevo',
        tipo: 'feriado',
        fecha: '01-01-2025',
        diaSemana: expect.any(String),
        mes: expect.any(String),
        esTraslado: false,
      });
    });

    it('should filter holidays by month', async () => {
      mockedAxios.get.mockResolvedValue({
        data: mockApiResponse,
        status: 200,
      });

      const result = await feriadosService.getFeriados({ mes: '5' });

      expect(result).toHaveLength(1);
      expect(result[0]?.motivo).toBe('Día del Trabajador');
    });

    it('should filter holidays by type', async () => {
      mockedAxios.get.mockResolvedValue({
        data: mockApiResponse,
        status: 200,
      });

      const result = await feriadosService.getFeriados({ tipo: 'feriado' });

      expect(result).toHaveLength(3);
    });

    it('should handle API errors appropriately', async () => {
      mockedAxios.get.mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 500,
          statusText: 'Failed to fetch holidays data',
        },
      });

      await expect(feriadosService.getFeriados()).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      mockedAxios.get.mockRejectedValue({
        isAxiosError: true,
        request: {},
      });

      await expect(feriadosService.getFeriados()).rejects.toThrow('Failed to fetch holidays data');
    });
  });

  describe('getFeriadosStats', () => {
    it('should return correct statistics', async () => {
      mockedAxios.get.mockResolvedValue({
        data: mockApiResponse,
        status: 200,
      });

      const stats = await feriadosService.getFeriadosStats();

      expect(stats).toMatchObject({
        total: 3,
        porTipo: {
          'feriado': 3,
        },
        traslados: 1,
        porMes: expect.any(Object),
      });
    });
  });
});