
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSectionContent } from '@/utils/siteContent';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [cmsContent, setCmsContent] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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

  useEffect(() => {
    // Fetch CMS override content if available
    const fetchContent = async () => {
      const content = await getSectionContent('home');
      if (content) setCmsContent(content);
    };
    
    fetchContent();
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-[80vh] flex items-center transition-all duration-1000 opacity-100 overflow-hidden">
      {cmsContent ? (
        <div className="container mx-auto px-4 z-10 w-full prose prose-invert max-w-4xl text-white" 
             dangerouslySetInnerHTML={{ __html: cmsContent }} />
      ) : (
        <>
          {/* Background with parallax effect */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-105"
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(249, 115, 22, 0.6)), url("https://images.unsplash.com/photo-1510425865936-0a352b16583f?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop")',
            }}
          >
            {/* Animated overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-iwc-blue/20 to-iwc-orange/20 animate-pulse" />
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-40 right-20 w-16 h-16 bg-iwc-orange/20 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-iwc-gold/20 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />

          <div className="container mx-auto px-4 z-10 text-center text-white relative">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight">
                  Welcome to 
                  <span className="block text-iwc-orange drop-shadow-lg">
                    Immanuel Worship Centre
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-100 leading-relaxed">
                  A place of worship, fellowship and spiritual growth where God's presence transforms lives through love, community, and purpose
                </p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="text-3xl font-bold text-iwc-orange">500+</div>
                  <div className="text-sm text-gray-200">Community Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="text-3xl font-bold text-iwc-gold">25+</div>
                  <div className="text-sm text-gray-200">Years of Service</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="text-3xl font-bold text-green-400">100+</div>
                  <div className="text-sm text-gray-200">Weekly Gatherings</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Button 
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-iwc-orange to-iwc-red hover:from-iwc-red hover:to-iwc-orange text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Link to="/services" className="flex items-center space-x-2">
                    <span>Explore Our Services</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-4 px-8 border-2 border-white/30 hover:border-white/50 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/contact" className="flex items-center space-x-2">
                    <span>Get in Touch</span>
                  </Link>
                </Button>

                <Button 
                  variant="ghost"
                  size="lg"
                  onClick={() => setIsVideoPlaying(true)}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 border border-white/20"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Welcome Video
                </Button>
              </div>

              {/* Quick Links */}
              <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <p className="text-gray-200 mb-4">Quick Links</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/events" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors border border-white/20">
                    Upcoming Events
                  </Link>
                  <Link to="/sermons" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors border border-white/20">
                    Recent Sermons
                  </Link>
                  <Link to="/donate" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors border border-white/20">
                    Give Online
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Video Modal */}
          {isVideoPlaying && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="relative bg-black rounded-lg overflow-hidden max-w-4xl w-full aspect-video">
                <button
                  onClick={() => setIsVideoPlaying(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
                >
                  ✕
                </button>
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Welcome Video"
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HeroSection;
