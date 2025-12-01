export interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  category: 'General' | 'Cosmetic' | 'Emergency' | 'Preventative';
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
  response: string; 
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  notes: string;
}

export interface QuickReply {
    label: string;
    prompt: string;
}