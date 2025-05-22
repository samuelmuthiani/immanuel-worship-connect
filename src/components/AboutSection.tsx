import React, { useEffect, useRef, useState } from 'react';
import { getSectionContent } from '@/utils/siteContent';

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [cmsContent, setCmsContent] = useState<string | null>(null);

  useEffect(() => {
    // Animate in
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
    // Fetch CMS content
    const fetchContent = async () => {
      const content = await getSectionContent('about');
      if (content) setCmsContent(content);
    };
    
    fetchContent();
  }, []);

  return (
    <div className="py-16 bg-gray-50">
      <div 
        ref={sectionRef}
        className="container mx-auto px-4 transition-all duration-1000 opacity-0 translate-y-10"
      >
        {cmsContent ? (
          <div className="prose mx-auto max-w-4xl mb-12" dangerouslySetInnerHTML={{ __html: cmsContent }} />
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">About Our Church</h2>
              <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Learn about our history, mission, and the values that guide our community of faith.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-iwc-blue">Our History</h3>
                <p className="text-gray-700 mb-4">
                  Founded in 1985, Immanuel Worship Centre began as a small gathering in the home of Pastor John and Mary Thompson. Their vision was to create a welcoming community centered on authentic worship and biblical teaching.
                </p>
                <p className="text-gray-700 mb-4">
                  Over the decades, our congregation has grown, but our commitment to being a place where people can encounter God's presence remains unchanged. Today, we continue to build on the foundation laid by our founders.
                </p>
                <h3 className="text-2xl font-semibold mb-4 text-iwc-blue mt-8">Our Vision</h3>
                <p className="text-gray-700">
                  To be a vibrant, Spirit-filled community that equips believers to fulfill their God-given purpose and impacts our city with the love and power of Christ.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop" 
                  alt="Church congregation" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-iwc-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-iwc-gold text-2xl">❤️</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Love</h3>
                <p className="text-gray-600">
                  We are committed to demonstrating Christ's love to everyone, recognizing that all people are created in God's image.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-iwc-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-iwc-blue text-2xl">📖</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Truth</h3>
                <p className="text-gray-600">
                  We are anchored in the timeless truths of God's Word, which guides our beliefs, values, and practices.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-iwc-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-iwc-red text-2xl">🙏</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Faith</h3>
                <p className="text-gray-600">
                  We believe in a God who still performs miracles today, and we approach Him with expectant faith.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AboutSection;
