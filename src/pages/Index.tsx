
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import EventsPreviewSection from '@/components/EventsPreviewSection';
import ContactSection from '@/components/ContactSection';
import ChurchLocationMap from '@/components/ChurchLocationMap';
import SEO from '@/components/SEO';

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="Immanuel Worship Centre | Spiritual Home in Kilifi"
        description="Immanuel Worship Centre is a vibrant spiritual community in Kilifi, Kenya. Join us for worship, ministry, and spiritual growth."
      />
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
