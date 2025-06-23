/**
 * Represents a holiday from the Argentina Datos API
 */
export interface FeriadoApiResponse {
  readonly motivo: string;
  readonly tipo: string;
  readonly fecha: string;
  readonly fechaOriginal?: string;
}

/**
 * Processed holiday data returned by our API
 */
export interface Feriado {
  readonly id: string;
  readonly motivo: string;
  readonly tipo: string;
  readonly fecha: string;
  readonly fechaOriginal?: string;
  readonly diaSemana: string;
  readonly mes: string;
  readonly esTraslado: boolean;
}

/**
 * Query parameters for filtering holidays
 */
export interface FeriadosQuery {
  mes?: string;
  tipo?: string;
}