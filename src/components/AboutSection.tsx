
import React from 'react';
import { Heart, BookOpen, Flame } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Love',
    description: 'We are committed to demonstrating Christ\'s love to everyone, recognizing that all people are created in God\'s image.',
  },
  {
    icon: BookOpen,
    title: 'Truth',
    description: 'We are anchored in the timeless truths of God\'s Word, which guides our beliefs, values, and practices.',
  },
  {
    icon: Flame,
    title: 'Faith',
    description: 'We believe in a God who still performs miracles today, and we approach Him with expectant faith.',
  },
];

const AboutSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">
              About Our Church
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
              A community built on faith since 1985
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Founded in 1985, Immanuel Worship Centre began as a small gathering in the home of Pastor John and Mary Thompson. Their vision was to create a welcoming community centered on authentic worship and biblical teaching.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Over the decades, our congregation has grown, but our commitment to being a place where people can encounter God's presence remains unchanged.
            </p>

            <div className="space-y-6">
              {values.map((v) => (
                <div key={v.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <v.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop"
                alt="Church congregation"
                className="w-full h-[500px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-6 shadow-xl max-w-xs hidden md:block">
              <p className="text-muted-foreground text-sm italic leading-relaxed">
                "To be a vibrant, Spirit-filled community that equips believers to fulfill their God-given purpose."
              </p>
              <p className="text-secondary font-semibold text-sm mt-3">— Our Vision</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
