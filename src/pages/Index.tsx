import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import EventsPreviewSection from '@/components/EventsPreviewSection';
import NewsletterSignup from '@/components/NewsletterSignup';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import { Calendar, Video, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [nextServiceTime, setNextServiceTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Calculate next Sunday service time
  useEffect(() => {
    const calculateNextSundayService = () => {
      const now = new Date();
      const nextSunday = new Date();
      
      // Set to next Sunday 9:00 AM
      nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
      if (now.getDay() === 0 && now.getHours() < 9) {
        // If it's Sunday and before 9 AM, use today
      } else {
        // Otherwise, move to next Sunday
        nextSunday.setDate(nextSunday.getDate() + (nextSunday.getDay() === 0 ? 0 : 7));
      }
      
      nextSunday.setHours(9, 0, 0, 0);
      setNextServiceTime(nextSunday);
    };

    calculateNextSundayService();
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!nextServiceTime) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = nextServiceTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Service time has passed, recalculate next service
        clearInterval(timer);
        setNextServiceTime(prev => {
          const next = new Date(prev?.getTime() || 0);
          next.setDate(next.getDate() + 7); // Next week
          return next;
        });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [nextServiceTime]);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Service Countdown Timer */}
      <div className="bg-iwc-blue text-white py-6 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Next Sunday Service</h3>
            <p className="text-lg">
              {nextServiceTime ? (
                `${nextServiceTime.toLocaleDateString('en-US', { weekday: 'long' })}, 
                ${nextServiceTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
              ) : "Loading..."}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{timeRemaining.days}</div>
              <div className="text-xs">Days</div>
            </div>
            <div className="text-2xl">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold">{timeRemaining.hours}</div>
              <div className="text-xs">Hours</div>
            </div>
            <div className="text-2xl">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold">{timeRemaining.minutes}</div>
              <div className="text-xs">Minutes</div>
            </div>
            <div className="text-2xl">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold">{timeRemaining.seconds}</div>
              <div className="text-xs">Seconds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/services" className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Calendar size={42} className="text-iwc-orange mb-3" />
              <h3 className="text-xl font-semibold mb-2">Join Us</h3>
              <p className="text-gray-600 text-center mb-4">Attend our Sunday service and other weekly gatherings</p>
              <button className="mt-auto bg-iwc-blue text-white py-2 px-4 rounded flex items-center">
                Learn More <ArrowRight size={16} className="ml-2" />
              </button>
            </Link>
            <a href="https://www.youtube.com/channel/your-channel" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Video size={42} className="text-iwc-orange mb-3" />
              <h3 className="text-xl font-semibold mb-2">Watch Live</h3>
              <p className="text-gray-600 text-center mb-4">Stream our services live or watch past recordings</p>
              <button className="mt-auto bg-iwc-red text-white py-2 px-4 rounded flex items-center">
                Watch Now <ArrowRight size={16} className="ml-2" />
              </button>
            </a>
            <Link to="/donate" className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users size={42} className="text-iwc-orange mb-3" />
              <h3 className="text-xl font-semibold mb-2">Support Our Mission</h3>
              <p className="text-gray-600 text-center mb-4">Donate to help us continue our community work</p>
              <button className="mt-auto bg-iwc-orange text-white py-2 px-4 rounded flex items-center">
                Donate Now <ArrowRight size={16} className="ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* About Section Preview */}
      <AboutSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Events Preview Section */}
      <EventsPreviewSection />

      {/* Newsletter Signup / Contact Prompt */}
      <section className="py-12 flex flex-col items-center bg-white dark:bg-gray-900">
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
