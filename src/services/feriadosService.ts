import axios, { AxiosResponse } from 'axios';
import { config } from '../config/config';
import { logger } from '../config/logger';
import { FeriadoApiResponse, Feriado, FeriadosQuery } from '../types/feriado';
import { DateUtils } from '../utils/dateUtils';
import { ApiError } from '../middleware/errorHandler';
import { randomUUID } from 'crypto';

/**
 * Service for handling holidays data from Argentina Datos API
 */
export class FeriadosService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = config.argentinaDataApiUrl;
  }

  /**
   * Fetch holidays from external API and process them
   */
  async getFeriados(query: FeriadosQuery = {}, requestId?: string): Promise<Feriado[]> {
    try {
      logger.info('Fetching holidays from external API', {
        requestId,
        apiUrl: `${this.apiUrl}/feriados/2025`,
        query,
      });

      const response: AxiosResponse<FeriadoApiResponse[]> = await axios.get(
        `${this.apiUrl}/feriados/2025`,
        {
          timeout: 10000,
          headers: {
            'User-Agent': 'TypeScript-REST-API/1.0.0',
          },
          // Follow redirects (equivalent to curl -L)
          maxRedirects: 5,
        }
      );

      logger.info('Successfully fetched holidays from external API', {
        requestId,
        count: response.data.length,
        status: response.status,
      });

      // Transform and filter data
      const processedFeriados = this.processApiResponse(response.data);
      
      return this.filterFeriados(processedFeriados, query);
    } catch (error) {
      logger.error('Failed to fetch holidays from external API', {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        apiUrl: `${this.apiUrl}/feriados/2025`,
      });

      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new ApiError(
            `External API error: ${error.response.status} ${error.response.statusText}`,
            502
          );
        } else if (error.request) {
          throw new ApiError('External API is not responding', 503);
        }
      }

      throw new ApiError('Failed to fetch holidays data', 500);
    }
  }

  /**
   * Process raw API response into our Feriado format
   */
  private processApiResponse(apiData: FeriadoApiResponse[]): Feriado[] {
    return apiData.map((item) => ({
      id: randomUUID(),
      motivo: item.motivo,
      tipo: item.tipo,
      fecha: item.fecha,
      ...(item.fechaOriginal && { fechaOriginal: item.fechaOriginal }),
      diaSemana: DateUtils.getDiaSemana(item.fecha),
      mes: DateUtils.getMes(item.fecha),
      esTraslado: Boolean(item.fechaOriginal && item.fechaOriginal !== item.fecha),
    }));
  }

  /**
   * Filter holidays based on query parameters
   */
  private filterFeriados(feriados: Feriado[], query: FeriadosQuery): Feriado[] {
    let filtered = feriados;

    // Filter by month
    if (query.mes) {
      const mesNumero = parseInt(query.mes, 10);
      filtered = filtered.filter(feriado => 
        DateUtils.getNumeroMes(feriado.fecha) === mesNumero
      );
    }

    // Filter by type
    if (query.tipo) {
      filtered = filtered.filter(feriado => 
        feriado.tipo.toLowerCase() === query.tipo?.toLowerCase()
      );
    }

    return filtered.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  /**
   * Get holidays statistics
   */
  async getFeriadosStats(requestId?: string): Promise<{
    total: number;
    porTipo: Record<string, number>;
    porMes: Record<string, number>;
    traslados: number;
  }> {
    const feriados = await this.getFeriados({}, requestId);

    const porTipo: Record<string, number> = {};
    const porMes: Record<string, number> = {};
    let traslados = 0;

    feriados.forEach(feriado => {
      // Count by type
      porTipo[feriado.tipo] = (porTipo[feriado.tipo] ?? 0) + 1;
      
      // Count by month
      porMes[feriado.mes] = (porMes[feriado.mes] ?? 0) + 1;
      
      // Count transfers
      if (feriado.esTraslado) {
        traslados++;
      }
    });

    return {
      total: feriados.length,
      porTipo,
      porMes,
      traslados,
    };
  }
}