
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import EventsPreviewSection from '@/components/EventsPreviewSection';
import ContactSection from '@/components/ContactSection';
import ChurchLocationMap from '@/components/ChurchLocationMap';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <EventsPreviewSection />
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <ChurchLocationMap />
        </div>
      </div>
      <TestimonialsSection />
      <ContactSection />
    </Layout>
  );
};

export default Index;
