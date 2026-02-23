
import React from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah O.",
    quote: "Immanuel Worship Centre is truly a family. I've grown so much in my faith here.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    role: "Member since 2018",
  },
  {
    name: "James R.",
    quote: "The worship and teaching are inspiring. I always feel welcomed.",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    role: "Youth Leader",
  },
  {
    name: "Grace L.",
    quote: "A place where my family found hope and community.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    role: "Volunteer",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">
            Testimonials
          </p>
          <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>
            What Our Members Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="bg-card border border-border rounded-2xl p-8 flex flex-col relative hover:shadow-lg transition-shadow"
              aria-label={`Testimonial from ${t.name}`}
            >
              <Quote className="h-8 w-8 text-secondary/30 mb-4" />
              <blockquote className="text-foreground text-lg leading-relaxed mb-6 flex-1" style={{ fontFamily: 'DM Serif Display, serif' }}>
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
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
