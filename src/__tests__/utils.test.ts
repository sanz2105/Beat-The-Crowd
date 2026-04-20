import { describe, it, expect } from 'vitest';
import { getCrowdStatus, formatWaitTime } from '../utils/statusUtils';

describe('statusUtils', () => {
  describe('getCrowdStatus', () => {
    it('returns low for < 40', () => {
      expect(getCrowdStatus(10)).toBe('low');
      expect(getCrowdStatus(39)).toBe('low');
    });

    it('returns moderate for 40-74', () => {
      expect(getCrowdStatus(40)).toBe('moderate');
      expect(getCrowdStatus(74)).toBe('moderate');
    });

    it('returns high for >= 75', () => {
      expect(getCrowdStatus(75)).toBe('high');
      expect(getCrowdStatus(99)).toBe('high');
    });
  });

  describe('formatWaitTime', () => {
    it('formats minutes only for < 60', () => {
      expect(formatWaitTime(2)).toBe('2 min');
      expect(formatWaitTime(45)).toBe('45 min');
    });

    it('formats hours and minutes for > 60', () => {
      expect(formatWaitTime(63)).toBe('1 hr 3 min');
      expect(formatWaitTime(120)).toBe('2 hr');
    });
  });
});
