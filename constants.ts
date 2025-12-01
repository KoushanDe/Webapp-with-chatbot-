import { Service, TeamMember, Testimonial } from './types';

export const CLINIC_INFO = {
  name: "Dr. Smith’s Family & Cosmetic Dentistry",
  phone: "+971-4-123-4567", // Placeholder UAE number as none provided in doc
  email: "care@drsmithdental.com",
  address: "The Citadel - Tower, Shop# 3, Ground floor, Business Bay, Dubai, UAE",
  googleMapsUrl: "https://maps.google.com/?q=The+Citadel+Tower+Business+Bay+Dubai",
  hours: "09:00 AM – 6:00 PM (Mon-Sat)",
};

export const SERVICES: Service[] = [
  {
    id: 's1',
    name: "New Patient Special",
    price: "$199",
    duration: "60 mins",
    description: "Full mouth X-rays, gum health check, professional cleaning, and doctor consultation.",
    category: 'General'
  },
  {
    id: 'e1',
    name: "Emergency Exam",
    price: "$99",
    duration: "30 mins",
    description: "Focused X-ray and diagnosis for pain or broken teeth. Fee waived if treatment done same-day.",
    category: 'Emergency'
  },
  {
    id: 'c1',
    name: "Invisalign Clear Aligners",
    price: "From $3,500",
    duration: "30 mins",
    description: "Teeth straightening without metal braces. Includes 3D scan. 0% financing available.",
    category: 'Cosmetic'
  },
  {
    id: 'w1',
    name: "Zoom Teeth Whitening",
    price: "$350 - $600",
    duration: "30 mins",
    description: "Professional in-office whitening (1 hour) or custom take-home kits.",
    category: 'Cosmetic'
  },
  {
    id: 'v1',
    name: "Porcelain Veneers",
    price: "~$1,200/tooth",
    duration: "30 mins",
    description: "Custom-made shells for a complete 'Hollywood Smile' transformation.",
    category: 'Cosmetic'
  },
  {
    id: 'i1',
    name: "Dental Implants",
    price: "~$3,000+",
    duration: "30 mins",
    description: "Permanent, natural-looking replacement for missing teeth.",
    category: 'General'
  }
];

export const TEAM: TeamMember[] = [
  {
    name: "Dr. Smith (DDS)",
    role: "Lead Dentist",
    // Professional male dentist
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Sarah",
    role: "Lead Hygienist",
    // Professional female hygienist
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Reception Team",
    role: "Front Desk & Billing",
    // Friendly reception
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed Al-Fayed",
    text: "The 'No-Wait' policy is real. I walked in and was in the chair within 5 minutes. Best dental experience in Dubai.",
    rating: 5
  },
  {
    id: 2,
    name: "Jessica Miller",
    text: "I was terrified of the dentist, but the sedation and Netflix on the ceiling made it a breeze. Dr. Smith is a magician.",
    rating: 5
  },
  {
    id: 3,
    name: "Rahul Gupta",
    text: "Got my Invisalign here with the payment plan. The 3D scan technology is incredible.",
    rating: 5
  }
];

export const FAQS = [
  {
    q: "Do you accept insurance?",
    a: "Yes, we accept most major PPO insurance plans and handle direct billing where possible."
  },
  {
    q: "Does the treatment hurt?",
    a: "Dr. Smith specializes in 'Pain-Free Dentistry'. We offer numbing gel and sedation (laughing gas) for nervous patients."
  },
  {
    q: "Can I get a same-day appointment?",
    a: "For emergencies (pain/bleeding), yes! We prioritize pain relief. For routine cleaning, we usually have next-day availability."
  },
  {
    q: "Is there parking available?",
    a: "Yes, free private parking is available behind the building."
  }
];