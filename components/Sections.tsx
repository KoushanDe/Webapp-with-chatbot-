import React from 'react';
import { ArrowRight, Scissors, Star, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { SERVICES, TEAM, TESTIMONIALS, FAQS, SALON_INFO } from '../constants';

export const Hero: React.FC = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Salon Interior" 
          className="w-full h-full object-cover animate-slow-zoom origin-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-salon-gold uppercase tracking-[0.2em] mb-4 font-medium animate-fade-in-up">
          Unisex Grooming Studio
        </p>
        <h1 className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 leading-tight drop-shadow-2xl">
          Refine Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-salon-gold to-yellow-200">Style</span>
        </h1>
        <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
          Experience premium hair, beard, and relaxation services in a calm, hygienic environment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#services" 
            onClick={(e) => scrollToSection(e, 'services')}
            className="px-8 py-3 bg-salon-gold text-black font-semibold rounded-full hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
          >
            View Services <ArrowRight size={18} />
          </a>
          <a 
            href="#contact" 
            onClick={(e) => scrollToSection(e, 'contact')}
            className="px-8 py-3 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
          >
            Visit Us
          </a>
        </div>
      </div>
    </section>
  );
};

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Our Services</h2>
          <div className="w-20 h-1 bg-salon-gold mx-auto" />
          <p className="mt-4 text-gray-600">Professional care for men and women.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div key={service.id} className="group p-6 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:bg-salon-gold transition-colors">
                  <Scissors className="text-salon-gold group-hover:text-white" size={24} />
                </div>
                <span className="font-serif font-bold text-xl text-gray-900">{service.price}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-500 mb-4 h-10">{service.description}</p>
              <div className="flex items-center text-xs text-gray-400 gap-2">
                <Clock size={14} />
                <span>{service.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Gallery: React.FC = () => {
  const images = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <section id="gallery" className="py-20 bg-zinc-900 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-12 text-center">Salon Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((src, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-xl aspect-[3/4] group">
              <img src={src} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-serif tracking-wider">ROXY</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">About Roxy Salon</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Located in the heart of BTM Layout, Roxy Salon is a premier unisex grooming studio. We believe that self-care is not a luxury, but a necessity. Our team of expert stylists is dedicated to providing precision cuts, soothing massages, and expert grooming services in a hygienic, relaxing environment.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-salon-gold" />
                <span className="text-sm font-medium">100% Hygienic Tools</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="text-salon-gold" />
                <span className="text-sm font-medium">Expert Stylists</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-salon-gold" />
                <span className="text-sm font-medium">Mon-Sun: 10AM - 8PM</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {TEAM.slice(0, 2).map((member, idx) => (
               <div key={idx} className={`relative rounded-2xl overflow-hidden ${idx === 1 ? 'mt-8' : ''}`}>
                 <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                 <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                   <p className="text-white font-bold">{member.name}</p>
                   <p className="text-salon-gold text-xs">{member.role}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-salon-gold/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-gray-900">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < t.rating ? 'fill-salon-gold text-salon-gold' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                    {t.name.charAt(0)}
                  </div>
                  <p className="font-bold text-gray-900 font-serif text-sm">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-20 bg-gray-50 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          {/* Map/Info - Centered and Expanded */}
          <div className="w-full max-w-4xl bg-zinc-900 text-white rounded-3xl p-8 md:p-12 overflow-hidden relative shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Visit Us</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-salon-gold shrink-0 mt-1" />
                    <p className="text-gray-300 leading-relaxed">{SALON_INFO.address}</p>
                  </div>
                   <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Hours</p>
                    <p className="text-white font-medium">{SALON_INFO.hours}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Contact</p>
                    <p className="text-white font-medium">{SALON_INFO.phone}</p>
                    <p className="text-white font-medium">{SALON_INFO.email}</p>
                  </div>
                </div>
              </div>

              <div className="h-full min-h-[250px] rounded-2xl overflow-hidden border border-gray-700">
                 <iframe 
                  title="Google Map Placeholder"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7509397042596!2d77.6092523!3d12.9157291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzU2LjYiTiA3N8KwMzYnMzMuMyJF!5e0!3m2!1sen!2sin!4v1633000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{border:0, minHeight: '250px'}} 
                  loading="lazy"
                ></iframe>
              </div>

            </div>
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-salon-gold opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};