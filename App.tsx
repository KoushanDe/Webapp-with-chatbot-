import React from 'react';
import { Header, Footer } from './components/LayoutComponents';
import { Hero, Services, Gallery, About, Testimonials, FAQ, Contact } from './components/Sections';
import { Chatbot } from './components/Chatbot';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <Hero />
        <Services />
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