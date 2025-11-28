import { WebhookPayload } from '../types';

const N8N_WEBHOOK_URL = 'https://75a3b2458836.ngrok-free.app/webhook/ddf0f354-83dc-43c6-ab6c-620d0284b7e9';

export const generateSessionId = (): string => {
  return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const sendToWebhook = async (payload: WebhookPayload): Promise<string> => {
  try {
    // Check if browser is online
    if (!navigator.onLine) {
        return "It looks like you're offline. Please check your internet connection.";
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    // Check specifically for ngrok browser warning or HTML response
    if (responseText.includes('ngrok-skip-browser-warning') || responseText.includes('<!DOCTYPE html>')) {
        console.warn("Ngrok warning page detected");
        return "Connection blocked by ngrok free tier warning. Please open the webhook URL in a browser once to accept the warning, or use a paid/production URL.";
    }

    if (!response.ok) {
      console.warn(`Webhook HTTP Error: ${response.status}`, responseText);
      throw new Error(`Server Error ${response.status}`);
    }

    // Handle empty responses (common with default 200 OK from webhooks)
    if (!responseText || !responseText.trim()) {
      return "Message received.";
    }
    
    // Try parsing as JSON
    try {
        const data = JSON.parse(responseText);
        
        // Handle N8N Array output (common structure)
        if (Array.isArray(data) && data.length > 0) {
            const item = data[0];
            if (item.output) return item.output;
            if (item.response) return item.response;
            if (item.text) return item.text;
            if (item.message) return item.message;
        }

        // Handle Single Object output
        if (typeof data === 'object') {
            if (data.output) return data.output;
            if (data.response) return data.response;
            if (data.text) return data.text;
            if (data.message) return data.message;
        }
        
        if (typeof data === 'string') return data;
        
        // Fallback if structure is valid JSON but field name is unknown
        return "I've received your request.";

    } catch (e) {
        // Response was not JSON, return raw text if it exists (and wasn't HTML detected earlier)
        if (responseText && responseText.trim().length > 0) {
            return responseText;
        }
        return "Message received.";
    }

  } catch (error) {
    console.error("Webhook Connection Error:", error);
    // Return a friendly error message to the chat interface
    return "Sorry some error has occurred on our side";
  }
};