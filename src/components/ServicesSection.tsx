import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const services = [
  {
    title: "Sunday Worship",
    time: "9:00 AM & 11:00 AM",
    description: "Join us for a time of vibrant worship, biblical teaching, and community.",
    image: "https://images.unsplash.com/photo-1578944161892-9f7e879ee7dd?ixlib=rb-4.0.3&q=80&w=400&auto=format&fit=crop"
  },
  {
    title: "Youth Service",
    time: "Friday 6:30 PM",
    description: "A dynamic service for teenagers to grow in their faith journey.",
    image: "https://images.unsplash.com/photo-1597675985321-b58a36a9f5c8?ixlib=rb-4.0.3&q=80&w=400&auto=format&fit=crop"
  },
  {
    title: "Bible Study",
    time: "Wednesday 7:00 PM",
    description: "Deepen your understanding of God's Word in an interactive setting.",
    image: "https://images.unsplash.com/photo-1611513933860-05970202a07e?ixlib=rb-4.0.3&q=80&w=400&auto=format&fit=crop"
  },
  {
    title: "Prayer Meeting",
    time: "Tuesday 6:00 AM",
    description: "Join our community in intercession for our church, city, and world.",
    image: "https://images.unsplash.com/photo-1591002455278-18b38fa63b2e?ixlib=rb-4.0.3&q=80&w=400&auto=format&fit=crop"
  }
];

const ServicesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [cmsContent, setCmsContent] = useState<string | null>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Fetch CMS override content if available
    (async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('site_content')
          .select('content')
          .eq('section', 'services')
          .single();
        if (!error && data && data.content) setCmsContent(data.content);
      } catch {}
    })();
  }, []);

  return (
    <div className="py-16 bg-white">
      <div
        ref={sectionRef}
        className="container mx-auto px-4 transition-all duration-1000 opacity-0 translate-y-10"
      >
        {cmsContent ? (
          <div className="prose mx-auto max-w-4xl" dangerouslySetInnerHTML={{ __html: cmsContent }} />
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Our Services</h2>
              <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Join us for worship, prayer, and community as we grow together in faith.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
                    <p className="text-iwc-orange font-medium mb-3">{service.time}</p>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Link
                      to="/services"
                      className="text-iwc-blue hover:text-iwc-orange transition-colors font-medium"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/services"
                className="bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-3 px-8 rounded-md transition-colors inline-block"
              >
                View All Services
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServicesSection;
