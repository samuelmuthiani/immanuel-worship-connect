
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, X, Church, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&q=85&w=1920&auto=format&fit=crop")',
        }}
      />
      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="container mx-auto px-4 z-10 relative py-20">
        <div className="max-w-3xl">
          {/* Accent line */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="w-12 h-[2px] bg-secondary" />
            <p className="text-secondary font-medium tracking-[0.25em] uppercase text-xs">
              Welcome to Our Community
            </p>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.05] mb-8 animate-fade-in"
            style={{ fontFamily: 'DM Serif Display, serif', animationDelay: '0.1s' }}
          >
            Immanuel{' '}
            <span className="text-secondary italic">Worship</span>
            <br />
            Centre
          </h1>

          <p className="text-lg md:text-xl text-white/75 max-w-xl mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A place of worship, fellowship and spiritual growth — where God's presence transforms lives through love, community, and purpose.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-full px-8 h-13 text-base shadow-lg shadow-secondary/25"
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
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/25 hover:border-white/40 rounded-full px-8 h-13 text-base"
            >
              <Play className="h-4 w-4 mr-2 fill-current" />
              Watch Video
            </Button>
          </div>

          {/* Stats row - redesigned with icons */}
          <div className="flex flex-wrap gap-10 md:gap-14 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Users, number: '500+', label: 'Community Members' },
              { icon: Church, number: '25+', label: 'Years of Service' },
              { icon: Calendar, number: '100+', label: 'Weekly Gatherings' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white leading-none" style={{ fontFamily: 'DM Serif Display, serif' }}>
                    {stat.number}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
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
