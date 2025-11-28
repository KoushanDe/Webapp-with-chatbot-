export interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  category: 'Hair' | 'Beard' | 'Relaxation' | 'Add-On';
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface WebhookPayload {
  sessionId: string;
  message: string;
}

export interface WebhookResponse {
  response: string; // Adjusted based on expected N8N output
  // Add other fields if your N8N workflow returns structured data
}