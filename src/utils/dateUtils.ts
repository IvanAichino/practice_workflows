/**
 * Utility functions for working with dates
 */
export class DateUtils {
  private static readonly DIAS_SEMANA = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  private static readonly MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  /**
   * Get Spanish day name from date string
   */
  static getDiaSemana(fechaString: string): string {
    const fecha = new Date(fechaString);
    return this.DIAS_SEMANA[fecha.getDay()] ?? 'Desconocido';
  }

  /**
   * Get Spanish month name from date string
   */
  static getMes(fechaString: string): string {
    const fecha = new Date(fechaString);
    //let month = fecha.getMonth() + 1 > 11 ? 0 : fecha.getMonth() + 1;
    return this.MESES[fecha.getMonth()] ?? 'Desconocido';
  }

  /**
   * Get month number (1-12) from date string
   */
  static getNumeroMes(fechaString: string): number {
    const fecha = new Date(fechaString);
    return fecha.getMonth() + 1;
  }

  /**
   * Check if date is valid
   */
  static isValidDate(fechaString: string): boolean {
    const fecha = new Date(fechaString);
    return !isNaN(fecha.getTime());
  }
}