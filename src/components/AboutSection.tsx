
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, Flame, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const values = [
  {
    icon: Heart,
    title: 'Love',
    description: "We are committed to demonstrating Christ's love to everyone, recognizing that all people are created in God's image.",
  },
  {
    icon: BookOpen,
    title: 'Truth',
    description: "We are anchored in the timeless truths of God's Word, which guides our beliefs, values, and practices.",
  },
  {
    icon: Flame,
    title: 'Faith',
    description: 'We believe in a God who still performs miracles today, and we approach Him with expectant faith.',
  },
];

const AboutSection = () => {
  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text content */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[2px] bg-secondary" />
              <p className="text-secondary font-medium tracking-[0.2em] uppercase text-xs">
                About Our Church
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
              A community built on <span className="text-secondary italic">faith</span> since 1985
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Founded in 1985, Immanuel Worship Centre began as a small gathering in the home of Pastor John and Mary Thompson. Their vision was to create a welcoming community centered on authentic worship and biblical teaching.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Over the decades, our congregation has grown, but our commitment to being a place where people can encounter God's presence remains unchanged.
            </p>

            <div className="space-y-6 mb-10">
              {values.map((v) => (
                <div key={v.title} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <v.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/about" className="flex items-center gap-2">
                Learn More About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop"
                alt="Church congregation"
                className="w-full h-[520px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-8 -left-4 bg-card border border-border rounded-2xl p-6 shadow-xl max-w-[280px] hidden md:block">
              <div className="w-8 h-[2px] bg-secondary mb-3" />
              <p className="text-muted-foreground text-sm italic leading-relaxed">
                "To be a vibrant, Spirit-filled community that equips believers to fulfill their God-given purpose."
              </p>
              <p className="text-secondary font-semibold text-sm mt-3">— Our Vision</p>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-secondary/20 rounded-3xl hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
