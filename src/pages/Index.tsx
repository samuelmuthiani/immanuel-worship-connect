import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import EventsPreviewSection from '@/components/EventsPreviewSection';
import NewsletterSignup from '@/components/NewsletterSignup';

const Index = () => {
  return (
    <Layout>
      {/* Modern Hero Section with background, heading, and CTAs */}
      <HeroSection />

      {/* Events Preview - modern carousel/cards */}
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-indigo-700 dark:text-indigo-300 animate-fade-in">
          Upcoming Events
        </h2>
        <EventsPreviewSection />
      </section>

      {/* Newsletter Signup / Contact Prompt */}
      <section className="py-12 flex flex-col items-center bg-white dark:bg-gray-900 animate-fade-in delay-600">
        <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Stay Connected</h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300 text-center max-w-lg">
          Subscribe to our newsletter for updates, inspiration, and event news. We respect your privacy.
        </p>
        <NewsletterSignup />
      </section>
    </Layout>
  );
};

export default Index;
