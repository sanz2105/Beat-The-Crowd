import type { Zone } from "./venueData";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const askGemini = async (userMessage: string, venueContext: Record<string, Zone>) => {
  const systemPrompt = `You are BeatTheCrowd AI — a smart stadium assistant at Champions League Final.
Your job: help fans navigate, avoid crowds, find food/restrooms, and stay safe.
Be concise, friendly, and action-oriented. Always suggest the least crowded option.

LIVE VENUE DATA (use this to answer):
${JSON.stringify(venueContext, null, 2)}

Answer in 2-3 sentences max. End with a specific actionable suggestion.`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: `${systemPrompt}\n\nUser Question: ${userMessage}` }
        ]
      }
    ]
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my stadium sensors right now. Please check the live heatmap for crowd updates!";
  }
};
