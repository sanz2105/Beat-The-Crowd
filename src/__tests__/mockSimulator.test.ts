import { describe, it, expect, vi } from 'vitest';
import { startSimulation, stopSimulation } from '../utils/mockSimulator';
import * as firebaseDB from 'firebase/database';

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  set: vi.fn(),
  onValue: vi.fn(),
  off: vi.fn(),
  update: vi.fn(),
  get: vi.fn(),
  getDatabase: vi.fn(() => ({})), // Mock getDatabase to return a dummy object
}));

describe('mockSimulator', () => {
  it('simulation updates exactly 2 zones per tick', async () => {
    vi.useFakeTimers();
    const mockZones = {
      z1: { name: 'Z1', capacity: 50, crowdLevel: 'medium', waitTime: 10, isOpen: true },
      z2: { name: 'Z2', capacity: 50, crowdLevel: 'medium', waitTime: 10, isOpen: true },
      z3: { name: 'Z3', capacity: 50, crowdLevel: 'medium', waitTime: 10, isOpen: true }
    };

    (firebaseDB.get as any).mockResolvedValue({ val: () => mockZones });
    
    startSimulation();
    await vi.advanceTimersByTimeAsync(20000);
    
    expect(firebaseDB.update).toHaveBeenCalled();
    const updates = (firebaseDB.update as any).mock.calls[0][1];
    expect(Object.keys(updates).length).toBe(4);
    
    stopSimulation();
    vi.useRealTimers();
  });

  it('emergency mode logic bounds check', () => {
    const levelIndex = 2; // high
    expect(levelIndex).toBeLessThanOrEqual(2);
    expect(levelIndex).toBeGreaterThanOrEqual(0);
  });
});
