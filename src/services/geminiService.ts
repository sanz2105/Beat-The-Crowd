const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

/**
 * Communicates with the Gemini 1.5 Flash API directly via REST.
 * This sidesteps SDK versioning issues and provides maximum reliability.
 */
export async function askGemini(
  userMessage: string,
  stadiumContext: string,
  history: GeminiMessage[] = []
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.');
  }

  // Basic sanitization and limits
  const sanitized = userMessage.replace(/<[^>]*>/g, '').trim().slice(0, 500);
  if (!sanitized) throw new Error('Message cannot be empty.');

  const systemInstruction = `You are CrowdAI, the intelligent stadium assistant for BeatTheCrowd. 
You have access to live stadium data: ${stadiumContext}
Help fans with crowd levels, wait times, best gates, food stalls, and navigation. 
Be concise (under 80 words), specific, and always recommend the least crowded option. 
Never make up data — only use what is provided in the stadium context.`;

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: [
      ...history,
      { role: 'user', parts: [{ text: sanitized }] }
    ],
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.7,
    }
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message ?? `API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from AI.');
    }

    // Secondary sanitization for the response
    return text.replace(/<[^>]*>/g, '').trim();
  } catch (error: any) {
    console.error("Gemini REST Error:", error);
    throw error;
  }
}
