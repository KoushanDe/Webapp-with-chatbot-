import React from 'react';
import { ArrowRight, Activity, Star, Clock, ShieldCheck, MapPin, Smile, Stethoscope, Tv, Coffee, Armchair } from 'lucide-react';
import { SERVICES, TEAM, TESTIMONIALS, FAQS, CLINIC_INFO } from '../constants';

export const Hero: React.FC = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Background Image with Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070&auto=format&fit=crop" 
          alt="Happy Family with Healthy Smiles" 
          className="w-full h-full object-cover animate-slow-zoom origin-center opacity-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent md:from-white md:via-white/70 md:to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-left">
          <p className="text-dental-teal uppercase tracking-[0.15em] mb-4 font-semibold text-sm animate-fade-in-up flex items-center gap-2">
            <ShieldCheck size={18} /> Pain-Free & Anxiety-Free
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-gray-900 font-bold mb-6 leading-tight drop-shadow-sm">
            World-Class Care in <span className="text-dental-teal">Dubai Business Bay</span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-10 font-light max-w-lg">
            Specializing in Invisalign, Implants, and Emergency Care. Enjoy a spa-like experience with ceiling TVs and noise-canceling headphones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#booking" 
              onClick={(e) => scrollToSection(e, 'booking')}
              className="px-8 py-4 bg-dental-teal text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
            >
              Book Appointment <ArrowRight size={18} />
            </a>
            <a 
              href="#pricing-grid" 
              onClick={(e) => scrollToSection(e, 'pricing-grid')}
              className="px-8 py-4 border-2 border-dental-teal text-dental-teal font-semibold rounded-lg hover:bg-dental-teal hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
            >
              View Pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ServicesProps {
  onBook?: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onBook }) => {
  return (
    <section id="services" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Transparent Pricing</h2>
          <div className="w-20 h-1 bg-dental-teal mx-auto rounded-full" />
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">High-quality care with clear costs. 0% Interest financing available for cosmetic procedures.</p>
        </div>

        {/* Added ID and extra scroll margin to target pricing grid specifically */}
        <div id="pricing-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-mt-32">
          {SERVICES.map((service) => (
            <div 
              key={service.id} 
              onClick={() => onBook && onBook(service.name)}
              className="group p-8 border border-gray-100 rounded-xl bg-dental-light/30 hover:bg-white hover:shadow-xl hover:border-dental-teal/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white rounded-lg shadow-sm group-hover:bg-dental-teal transition-colors border border-gray-100">
                  <Activity className="text-dental-teal group-hover:text-white" size={24} />
                </div>
                <span className="font-semibold text-lg text-dental-teal bg-teal-50 px-3 py-1 rounded-full text-xs uppercase tracking-wide">{service.category}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 relative min-h-[40px]">
                <div className="flex items-center text-xs text-gray-500 gap-1.5">
                    <Clock size={14} />
                    <span>{service.duration}</span>
                </div>
                
                {/* CTA Text Popup in the middle */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
                     <span className="text-dental-teal font-bold text-xs uppercase tracking-widest bg-white/95 backdrop-blur px-3 py-1.5 rounded shadow-sm border border-teal-100 flex items-center gap-1.5 whitespace-nowrap">
                        Book Now 📅
                     </span>
                </div>

                <span className="text-sm font-bold text-gray-900">{service.price}</span>
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
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80", // Modern Clinic
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80", // Dental tools/Clean
    "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80", // Happy Patient
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80", // Child Smile
  ];

  return (
    <section id="gallery" className="py-24 bg-gray-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">Office Tour</h2>
                <p className="text-gray-500">Relax in our modern suites with Business Bay views.</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((src, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-lg aspect-[4/3] group shadow-sm">
              <img 
                src={src} 
                alt={`Clinic View ${idx}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-dental-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">More Than Just a Dentist</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              We understand dental anxiety. That's why Dr. Smith has created a soothing environment where your comfort comes first. With over 15 years of experience in Cosmetic Dentistry, you are in safe hands.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-dental-light rounded-full text-dental-teal"><Tv size={20} /></div>
                <span className="text-sm font-semibold text-gray-700">Ceiling TVs + Netflix</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-dental-light rounded-full text-dental-teal"><Armchair size={20} /></div>
                <span className="text-sm font-semibold text-gray-700">Sedation Options</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-dental-light rounded-full text-dental-teal"><Clock size={20} /></div>
                <span className="text-sm font-semibold text-gray-700">"No-Wait" Policy</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-dental-light rounded-full text-dental-teal"><Coffee size={20} /></div>
                <span className="text-sm font-semibold text-gray-700">Coffee Bar</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {TEAM.slice(0, 2).map((member, idx) => (
               <div key={idx} className={`relative rounded-xl overflow-hidden shadow-lg ${idx === 1 ? 'mt-12' : ''}`}>
                 <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-72 object-cover" 
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute bottom-0 inset-x-0 bg-white/95 p-4 backdrop-blur-sm">
                   <p className="text-gray-900 font-bold">{member.name}</p>
                   <p className="text-dental-teal text-xs font-semibold uppercase">{member.role}</p>
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
    <section id="testimonials" className="py-24 bg-dental-light scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16 text-gray-900">Patient Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-xl shadow-sm border border-transparent hover:border-dental-teal/30 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed text-sm md:text-base">"{t.text}"</p>
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-dental-teal/10 flex items-center justify-center text-sm font-bold text-dental-teal">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">Verified Patient</p>
                  </div>
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
    <section id="faq" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif font-bold text-center mb-12 text-gray-900">Patient FAQ</h2>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-100 p-6 rounded-lg hover:bg-dental-light/20 transition-colors">
              <h3 className="font-semibold text-lg text-dental-teal mb-2">{faq.q}</h3>
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
    <section id="contact" className="py-20 bg-gray-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          {/* Map/Info - Centered and Expanded */}
          <div className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              <div className="p-10 md:p-12 bg-dental-teal text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-serif font-bold mb-8">Visit Our Clinic</h2>
                    <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <MapPin className="text-teal-200 shrink-0 mt-1" />
                        <div>
                            <p className="text-teal-100 uppercase text-xs font-bold tracking-wider mb-1">Address</p>
                            <p className="text-white leading-relaxed text-lg">{CLINIC_INFO.address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                         <Clock className="text-teal-200 shrink-0 mt-1" />
                         <div>
                            <p className="text-teal-100 uppercase text-xs font-bold tracking-wider mb-1">Hours</p>
                            <p className="text-white font-medium text-lg">{CLINIC_INFO.hours}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-teal-100 uppercase text-xs font-bold tracking-wider mb-2">Contact</p>
                        <p className="text-white font-medium text-2xl">{CLINIC_INFO.phone}</p>
                        <p className="text-teal-100 mt-1">{CLINIC_INFO.email}</p>
                    </div>
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-600 rounded-full opacity-50"></div>
                <div className="absolute top-12 right-12 w-12 h-12 border-2 border-teal-400 rounded-full opacity-30"></div>
              </div>

              <div className="h-full min-h-[400px] bg-gray-200">
                 {/* Updated Map to The Citadel Tower, Business Bay, Dubai */}
                 <iframe 
                  title="Clinic Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.123456789!2d55.274!3d25.186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f433405f6e305%3A0x6c6e75525380541!2sThe%20Citadel%20Tower%20-%20Business%20Bay%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1633000000000!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  loading="lazy"
                ></iframe>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};