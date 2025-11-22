import {
  formatCurrency,
  formatDate,
  slugify,
  truncate,
  capitalizeFirst,
  getInitials,
  validateEmail,
  validatePhone,
  calculateEMI,
} from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats INR currency correctly', () => {
      expect(formatCurrency(1000)).toBe('₹1,000.00');
      expect(formatCurrency(1234567.89)).toBe('₹12,34,567.89');
    });

    it('handles zero and negative values', () => {
      expect(formatCurrency(0)).toBe('₹0.00');
      expect(formatCurrency(-500)).toBe('-₹500.00');
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2025-01-15');

    it('formats short date', () => {
      const result = formatDate(testDate, 'short');
      expect(result).toContain('15');
      expect(result).toContain('1'); // Month
    });

    it('formats long date', () => {
      const result = formatDate(testDate, 'long');
      expect(result).toContain('January');
      expect(result).toContain('2025');
    });
  });

  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test   Multiple   Spaces')).toBe('test-multiple-spaces');
    });

    it('removes special characters', () => {
      expect(slugify('Test@#$%^&*()123')).toBe('test123');
    });

    it('handles empty string', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncate(longText, 20)).toBe('This is a very long ...');
    });

    it('does not truncate short text', () => {
      const shortText = 'Short';
      expect(truncate(shortText, 20)).toBe('Short');
    });
  });

  describe('capitalizeFirst', () => {
    it('capitalizes first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('WORLD')).toBe('World');
    });
  });

  describe('getInitials', () => {
    it('gets initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Alice Bob Charlie')).toBe('AB');
    });

    it('handles single name', () => {
      expect(getInitials('John')).toBe('J');
    });
  });

  describe('validateEmail', () => {
    it('validates correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.in')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('validates correct phone numbers', () => {
      expect(validatePhone('9876543210')).toBe(true);
      expect(validatePhone('+91-9876543210')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abcdefghij')).toBe(false);
    });
  });

  describe('calculateEMI', () => {
    it('calculates flat rate EMI correctly', () => {
      const result = calculateEMI(100000, 10, 12, 'FLAT_RATE');

      expect(result.monthlyEMI).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.totalAmount).toBe(result.monthlyEMI * 12);
    });

    it('calculates reducing balance EMI correctly', () => {
      const result = calculateEMI(100000, 10, 12, 'REDUCING_BALANCE');

      expect(result.monthlyEMI).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.totalAmount).toBe(100000 + result.totalInterest);
    });

    it('reducing balance EMI should be less than flat rate', () => {
      const flat = calculateEMI(100000, 10, 12, 'FLAT_RATE');
      const reducing = calculateEMI(100000, 10, 12, 'REDUCING_BALANCE');

      expect(reducing.totalInterest).toBeLessThan(flat.totalInterest);
    });
  });
});
