/**
 * Utility functions for data validation and type guarding.
 */

/**
 * Validates if a string is a valid Firebase RTDB key.
 */
export const isValidFirebaseKey = (key: string): boolean => {
  return typeof key === 'string' && key.length > 0 && !/[.$#[\]]/.test(key);
};

/**
 * Ensures a number is within a specific range (e.g., crowd percentage).
 */
export const clamp = (value: number, min: number = 0, max: number = 100): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Type guard for stadium zones to ensure required fields exist.
 */
export interface ValidatedZone {
  name: string;
  capacity: number;
  waitTime: number;
  type: string;
  isOpen: boolean;
}

export const isValidZone = (zone: any): zone is ValidatedZone => {
  return (
    typeof zone === 'object' &&
    zone !== null &&
    typeof zone.name === 'string' &&
    typeof zone.capacity === 'number' &&
    typeof zone.waitTime === 'number'
  );
};

/**
 * Checks if a Gemini API response string is non-empty after trimming.
 */
export const isValidAIResponse = (text: string | null | undefined): boolean => {
  return typeof text === 'string' && text.trim().length > 0;
};
