/**
 * Sanitizes user input to prevent prompt injection and XSS.
 * Removes any content between < and > tags and trims whitespace.
 */
export const sanitizeUserInput = (input: string): string => {
  return input.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Sanitizes AI responses to ensure no HTML tags are rendered.
 * Although we render as plain text, this provides a second layer of defense.
 */
export const sanitizeAIResponse = (text: string): string => {
  return text.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Simple rate limiter using local state/refs.
 * In a real app, this should be enforced on the backend.
 */
export const isRateLimited = (timestamps: number[], limit: number = 10, windowMs: number = 60000): { limited: boolean; waitTime: number } => {
  const now = Date.now();
  const recent = timestamps.filter(t => now - t < windowMs);
  
  if (recent.length >= limit) {
    const oldestInWindow = recent[0];
    const waitTime = Math.ceil((windowMs - (now - oldestInWindow)) / 1000);
    return { limited: true, waitTime };
  }
  
  return { limited: false, waitTime: 0 };
};
