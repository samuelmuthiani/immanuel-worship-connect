
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1510425865936-0a352b16583f?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop")',
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      <div className="container mx-auto px-4 z-10 relative py-20">
        <div className="max-w-3xl">
          {/* Tagline */}
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-6 animate-fade-in">
            Welcome Home
          </p>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-8 animate-fade-in"
            style={{ fontFamily: 'DM Serif Display, serif', animationDelay: '0.1s' }}
          >
            Immanuel<br />
            <span className="text-secondary">Worship Centre</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A place of worship, fellowship and spiritual growth where God's presence transforms lives through love, community, and purpose.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-full px-8 h-12"
            >
              <Link to="/services" className="flex items-center gap-2">
                Explore Our Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsVideoPlaying(true)}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 hover:border-white/40 rounded-full px-8 h-12"
            >
              <Play className="h-4 w-4 mr-2" />
              Watch Video
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 md:gap-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'DM Serif Display, serif' }}>500+</div>
              <div className="text-sm text-white/60 mt-1">Community Members</div>
            </div>
            <div className="w-px bg-white/20 hidden md:block" />
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'DM Serif Display, serif' }}>25+</div>
              <div className="text-sm text-white/60 mt-1">Years of Service</div>
            </div>
            <div className="w-px bg-white/20 hidden md:block" />
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'DM Serif Display, serif' }}>100+</div>
              <div className="text-sm text-white/60 mt-1">Weekly Gatherings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative bg-black rounded-2xl overflow-hidden max-w-4xl w-full aspect-video">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 text-white hover:text-white/80 z-10 bg-white/10 backdrop-blur-sm rounded-full p-2"
            >
              <X className="h-5 w-5" />
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
    </section>
  );
};

export default HeroSection;
