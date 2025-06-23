import { DateUtils } from '../../utils/dateUtils';

describe('DateUtils', () => {
  describe('getDiaSemana', () => {
    it('should return correct Spanish day name', () => {
      expect(DateUtils.getDiaSemana('01-01-2025')).toBe('Miércoles');
      expect(DateUtils.getDiaSemana('12-25-2025')).toBe('Jueves');
    });

    it('should handle invalid dates gracefully', () => {
      expect(DateUtils.getDiaSemana('invalid-date')).toBe('Desconocido');
    });
  });

  describe('getMes', () => {
    it('should return correct Spanish month name', () => {
      expect(DateUtils.getMes('01-01-2025')).toBe('Enero');
      expect(DateUtils.getMes('12-25-2025')).toBe('Diciembre');
    });

    it('should handle invalid dates gracefully', () => {
      expect(DateUtils.getMes('invalid-date')).toBe('Desconocido');
    });
  });

  describe('getNumeroMes', () => {
    it('should return correct month number', () => {
      expect(DateUtils.getNumeroMes('01-01-2025')).toBe(1);
      expect(DateUtils.getNumeroMes('12-25-2025')).toBe(12);
    });

    it('should handle invalid dates', () => {
      expect(isNaN(DateUtils.getNumeroMes('invalid-date'))).toBe(true);
    });
  });

  describe('isValidDate', () => {
    it('should validate dates correctly', () => {
      expect(DateUtils.isValidDate('01-01-2025')).toBe(true);
      expect(DateUtils.isValidDate('12-25-2025')).toBe(true);
      expect(DateUtils.isValidDate('invalid-date')).toBe(false);
      expect(DateUtils.isValidDate('13-01-2025')).toBe(false);
    });
  });
});