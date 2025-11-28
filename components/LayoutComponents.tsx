import React, { useState } from 'react';
import { Menu, X, Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';
import { SALON_INFO } from '../constants';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Close mobile menu if it's open
      setMobileMenuOpen(false);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a 
      href={`#${href}`}
      onClick={(e) => handleScroll(e, href)}
      className="text-gray-300 hover:text-salon-gold transition-colors duration-200 text-sm tracking-wide uppercase font-medium cursor-pointer"
    >
      {children}
    </a>
  );

  return (
    <header className="fixed w-full top-0 z-50 bg-salon-dark/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 
              className="text-2xl md:text-3xl font-serif font-bold text-salon-gold tracking-tighter cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              ROXY<span className="text-white">SALON</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="services">Services</NavLink>
            <NavLink href="gallery">Gallery</NavLink>
            <NavLink href="about">About</NavLink>
            <NavLink href="testimonials">Testimonials</NavLink>
            <NavLink href="contact">Contact</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-gray-800 absolute w-full left-0 z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            {['services', 'gallery', 'about', 'testimonials', 'contact'].map((item) => (
              <a 
                key={item}
                href={`#${item}`} 
                onClick={(e) => handleScroll(e, item)} 
                className="block px-3 py-2 text-white hover:text-salon-gold w-full text-center capitalize cursor-pointer"
              >
                {item}
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
    <footer className="bg-zinc-950 text-gray-400 py-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-serif text-white mb-4">ROXY SALON</h2>
          <p className="text-sm leading-relaxed mb-4">
            A premium unisex grooming studio dedicated to style, hygiene, and relaxation.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-salon-gold transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-salon-gold transition-colors"><Facebook size={20} /></a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-medium mb-4 uppercase tracking-wider">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="text-salon-gold shrink-0" size={18} />
              <span>{SALON_INFO.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-salon-gold shrink-0" size={18} />
              <a href={`tel:${SALON_INFO.phone}`} className="hover:text-white">{SALON_INFO.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-salon-gold shrink-0" size={18} />
              <a href={`mailto:${SALON_INFO.email}`} className="hover:text-white">{SALON_INFO.email}</a>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h3 className="text-white font-medium mb-4 uppercase tracking-wider">Opening Hours</h3>
          <p className="text-sm mb-2">Monday - Sunday</p>
          <p className="text-white font-serif text-lg">{SALON_INFO.hours}</p>
          <p className="text-xs mt-4 text-gray-500">
            Walk-ins welcome based on availability.
          </p>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-900 text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} Roxy Salon. All rights reserved.
      </div>
    </footer>
  );
};