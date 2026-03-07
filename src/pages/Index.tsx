
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
      <TestimonialsSection />
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <ChurchLocationMap />
        </div>
      </section>
      <ContactSection />
    </Layout>
  );
};

export default Index;
