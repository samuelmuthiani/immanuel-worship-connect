
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import EventsPreviewSection from '@/components/EventsPreviewSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';

const Home = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <EventsPreviewSection />
        <TestimonialsSection />
        <ContactSection />
      </div>
    </Layout>
  );
};

export default Home;
