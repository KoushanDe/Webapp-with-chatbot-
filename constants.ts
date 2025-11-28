import { Service, TeamMember, Testimonial } from './types';

export const SALON_INFO = {
  name: "Roxy Salon",
  phone: "+91-8910453538",
  email: "koushanriki007@gmail.com",
  address: "1st Floor, No.780, 16th Main Rd, BTM 2nd Stage, Bengaluru, Karnataka 560076",
  googleMapsUrl: "https://maps.google.com/?q=Roxy+Salon+BTM+Layout",
  hours: "10:00 AM – 8:00 PM (Mon-Sun)",
};

export const SERVICES: Service[] = [
  {
    id: 'h1',
    name: "Haircut & Styling",
    price: "₹499",
    duration: "30 mins",
    description: "Precision cut tailored to your style with basic styling.",
    category: 'Hair'
  },
  {
    id: 'b1',
    name: "Beard Grooming",
    price: "₹299",
    duration: "20-30 mins",
    description: "Detailed trim, shape, hot towel, and beard oil.",
    category: 'Beard'
  },
  {
    id: 'r1',
    name: "Relaxing Head Massage",
    price: "₹399",
    duration: "20 mins",
    description: "Therapeutic scalp massage with aromatic oils.",
    category: 'Relaxation'
  },
  {
    id: 'h2',
    name: "Hair Wash & Condition",
    price: "₹149",
    duration: "15 mins",
    description: "Shampoo and conditioner with scalp cleanse.",
    category: 'Hair'
  },
  {
    id: 'b2',
    name: "Beard Styling",
    price: "On Request",
    duration: "Var",
    description: "Precise shaping for formal or casual looks.",
    category: 'Beard'
  },
  {
    id: 'a1',
    name: "Deep Conditioning",
    price: "₹199",
    duration: "Add-on",
    description: "Intense moisture treatment for healthy hair.",
    category: 'Add-On'
  }
];

export const TEAM: TeamMember[] = [
  {
    name: "Rahul S.",
    role: "Lead Stylist",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop"
  },
  {
    name: "Priya M.",
    role: "Massage Specialist",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop"
  },
  {
    name: "Amit K.",
    role: "Junior Stylist",
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=300&auto=format&fit=crop"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Arjun Das",
    text: "Best haircut I've had in BTM. The head massage is a must-try!",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    text: "Very hygienic and professional. Love the unisex vibe.",
    rating: 5
  },
  {
    id: 3,
    name: "Michael T.",
    text: "Great beard trim. The staff really listens to what you want.",
    rating: 4
  }
];

export const FAQS = [
  {
    q: "Do you accept walk-ins?",
    a: "Yes, walk-ins are welcome based on availability."
  },
  {
    q: "Are your products safe?",
    a: "Yes, we use dermatologically tested, salon-grade products."
  },
  {
    q: "Do you cut women's hair?",
    a: "Absolutely! We are a unisex salon."
  },
  {
    q: "What languages do you speak?",
    a: "English, Hindi, Bengali, and Thai."
  }
];