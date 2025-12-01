import { GoogleGenAI, Type } from "@google/genai";
import { QuickReply } from '../types';

export const generateGeminiSuggestions = async (
  botMessage: string,
  fallbackSuggestions: QuickReply[]
): Promise<QuickReply[]> => {
  // Access API Key from environment variable as per system instructions
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
      console.warn("Gemini API Key is missing. Using regex fallback.");
      return [];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Bot Message: "${botMessage}"\n\nFallback/Template Options: ${JSON.stringify(fallbackSuggestions.map(s => s.label))}`,
      config: {
        systemInstruction: `You are an intelligent UX assistant for a dental clinic chatbot named Sarah.
        Your goal is to predict the user's next likely actions based on the bot's message and generate 3-5 "Quick Reply" buttons.
        
        Context:
        - Clinic: Dr. Smith's Family & Cosmetic Dentistry
        - Services: Invisalign, Implants, Emergency Care, Whitening, Checkups.
        
        Rules for Suggestions:
        1. Analyze the Bot's Message for intent (e.g., asking for time, offering price, greeting).
        2. Generate specific, actionable replies.
        3. If the bot asks a Yes/No question, include "Yes" and "No" buttons, but also context-specific ones (e.g., "Yes, book 10am").
        4. If specific times are mentioned (e.g., "10:00 AM is free"), create a button like "Book 10:00 AM".
        5. Be concise. Label max 3-4 words.
        6. ALWAYS include a relevant emoji at the beginning of every Label.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              prompt: { type: Type.STRING }
            },
            required: ["label", "prompt"]
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return [];

  } catch (error) {
    console.error("Error generating Gemini suggestions:", error);
    return [];
  }
};