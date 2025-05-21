
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <div ref={heroRef} className="relative h-[70vh] flex items-center transition-all duration-1000 opacity-0 translate-y-10">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1510425865936-0a352b16583f?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop")',
        }}
      ></div>
      <div className="container mx-auto px-4 z-10 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to Immanuel Worship Centre</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
          A place of worship, fellowship and spiritual growth where God's presence transforms lives
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/services" className="bg-iwc-orange hover:bg-iwc-red text-white font-bold py-3 px-8 rounded-md transition-colors">
            Our Services
          </Link>
          <Link to="/contact" className="bg-transparent hover:bg-white/10 text-white font-bold py-3 px-8 border-2 border-white rounded-md transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
