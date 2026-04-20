import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  set: vi.fn(),
  onValue: vi.fn(),
  off: vi.fn(),
  update: vi.fn(),
  get: vi.fn(),
  getDatabase: vi.fn(() => ({}))
}));

// Mock scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();
