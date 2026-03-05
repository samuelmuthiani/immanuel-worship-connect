
import React from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah O.",
    quote: "Immanuel Worship Centre is truly a family. I've grown so much in my faith and found lifelong friends here.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    role: "Member since 2018",
  },
  {
    name: "James R.",
    quote: "The worship and teaching are truly inspiring. Every Sunday feels like a fresh encounter with God.",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    role: "Youth Leader",
  },
  {
    name: "Grace L.",
    quote: "A place where my family found hope, healing, and a loving community that truly cares.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    role: "Volunteer",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-28 bg-background" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-secondary" />
            <p className="text-secondary font-medium tracking-[0.2em] uppercase text-xs">
              Testimonials
            </p>
            <div className="w-10 h-[2px] bg-secondary" />
          </div>
          <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>
            What Our <span className="text-secondary italic">Members</span> Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="bg-card border border-border rounded-2xl p-8 flex flex-col relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              aria-label={`Testimonial from ${t.name}`}
            >
              <Quote className="h-8 w-8 text-secondary/20 mb-4 group-hover:text-secondary/40 transition-colors" />
              <blockquote className="text-foreground text-lg leading-relaxed mb-8 flex-1" style={{ fontFamily: 'DM Serif Display, serif' }}>
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-secondary/20"
                  loading="lazy"
                />
                <div>
                  <figcaption className="font-semibold text-foreground text-sm">{t.name}</figcaption>
                  <span className="text-xs text-muted-foreground">{t.role}</span>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
