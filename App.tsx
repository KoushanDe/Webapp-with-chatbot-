import React, { useState } from 'react';
import { Header, Footer } from './components/LayoutComponents';
import { Hero, Services, Gallery, About, Testimonials, FAQ, Contact } from './components/Sections';
import { BookingSection } from './components/BookingSection';
import { Chatbot } from './components/Chatbot';

function App() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
    // Add a timestamp to force update even if selecting the same service twice
    // (Managed by just passing the string for now, distinct enough for this flow)
    
    // Scroll to booking section
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <Hero />
        {/* Placed Booking Section prominently after Hero/Services for better conversion */}
        <Services onBook={handleServiceSelect} />
        <BookingSection prefilledService={selectedService} /> 
        <Gallery />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      <Footer />
      
      {/* Floating Chatbot Widget */}
      <Chatbot />
    </div>
  );
}

export default App;