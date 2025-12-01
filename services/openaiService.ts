import { QuickReply } from '../types';

// IMPORTANT: Replace this with your actual OpenAI API Key
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE'; 

export const generateAISuggestions = async (
  botMessage: string, 
  fallbackSuggestions: QuickReply[]
): Promise<QuickReply[]> => {
  // If no key is provided, return null to signal the app to use fallback regex logic
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
      console.warn("OpenAI API Key is missing. Using regex fallback.");
      return [];
  }

  const systemPrompt = `
    You are an intelligent UX assistant for a dental clinic chatbot.
    Your goal is to predict the user's next likely actions based on the bot's message and generate 3-5 "Quick Reply" buttons.
    
    Context:
    - Bot Name: Sarah (Dental Receptionist)
    - Clinic: Dr. Smith's Family & Cosmetic Dentistry
    - Services: Invisalign, Implants, Emergency Care, Whitening, Checkups.
    
    Rules for Suggestions:
    1. Analyze the Bot's Message for intent (e.g., asking for time, offering price, greeting).
    2. Generate specific, actionable replies.
    3. If the bot asks a Yes/No question, include "Yes" and "No" but also include a context-specific option (e.g., "Yes, book 10am").
    4. If specific times are mentioned (e.g., "10:00 AM is free"), create a button like "Book 10:00 AM".
    5. Be concise. Label max 3-4 words.
    
    Output Format:
    Return ONLY a raw JSON array.
    [{"label": "Button Text", "prompt": "Full message text to send"}]
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Bot Message: "${botMessage}"\n\nFallback/Template Options (for context): ${JSON.stringify(fallbackSuggestions.map(s => s.label))}` 
          }
        ],
        temperature: 0.5,
        max_tokens: 200
      })
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
        return [];
    }

    const content = data.choices[0].message.content;
    // Clean up markdown code blocks if present (common with LLM output)
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(cleanJson);
    return Array.isArray(parsed) ? parsed : [];

  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    return [];
  }
};