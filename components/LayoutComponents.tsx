import React, { useState } from 'react';
import { Menu, X, Facebook, MapPin, Phone, Mail, Linkedin } from 'lucide-react';
import { CLINIC_INFO } from '../constants';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onNavigate: (e: React.MouseEvent<HTMLElement>, id: string) => void;
}

const NavLink = ({ href, children, onNavigate }: NavLinkProps) => (
  <a 
    href={`#${href}`}
    onClick={(e) => onNavigate(e, href)}
    className="text-gray-600 hover:text-dental-teal transition-colors duration-200 text-sm tracking-wide font-semibold cursor-pointer"
  >
    {children}
  </a>
);

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      setMobileMenuOpen(false);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <h1 
              className="text-2xl md:text-2xl font-serif font-bold text-dental-teal tracking-tight cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              DR. SMITH'S <span className="text-gray-400 font-sans font-light text-lg">DENTISTRY</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="services" onNavigate={handleScroll}>Treatments</NavLink>
            <NavLink href="about" onNavigate={handleScroll}>Our Team</NavLink>
            <NavLink href="testimonials" onNavigate={handleScroll}>Patients</NavLink>
            <NavLink href="faq" onNavigate={handleScroll}>FAQ</NavLink>
            <NavLink href="contact" onNavigate={handleScroll}>Contact</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-dental-teal p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 z-50 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            {['services', 'about', 'testimonials', 'faq', 'contact'].map((item) => (
              <a 
                key={item}
                href={`#${item}`} 
                onClick={(e) => handleScroll(e, item)} 
                className="block px-3 py-4 text-gray-800 hover:text-dental-teal w-full text-center capitalize font-medium cursor-pointer border-b border-gray-50 last:border-none"
              >
                {item === 'services' ? 'Treatments' : item}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dental-dark text-gray-300 py-12 border-t border-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-serif text-white mb-4">Dr. Smith's Dentistry</h2>
          <p className="text-sm leading-relaxed mb-4 text-gray-400">
            Providing compassionate, state-of-the-art dental care for the entire family. Your smile is our priority.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-dental-teal transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-dental-teal transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-medium mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="text-dental-teal shrink-0" size={18} />
              <span>{CLINIC_INFO.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-dental-teal shrink-0" size={18} />
              <a href={`tel:${CLINIC_INFO.phone}`} className="hover:text-white">{CLINIC_INFO.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-dental-teal shrink-0" size={18} />
              <a href={`mailto:${CLINIC_INFO.email}`} className="hover:text-white">{CLINIC_INFO.email}</a>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h3 className="text-white font-medium mb-4 uppercase tracking-wider text-sm">Office Hours</h3>
          <p className="text-sm mb-2">Monday - Saturday</p>
          <p className="text-white font-serif text-lg">{CLINIC_INFO.hours}</p>
          <p className="text-xs mt-4 text-teal-500">
            Emergency cases seen same day.
          </p>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-teal-900 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Dr. Smith's Family & Cosmetic Dentistry. All rights reserved.
      </div>
    </footer>
  );
};