
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    title: "Sunday Worship",
    time: "9:00 AM & 11:00 AM",
    description: "Join us for a time of vibrant worship, biblical teaching, and community.",
    image: "https://images.unsplash.com/photo-1578944161892-9f7e879ee7dd?ixlib=rb-4.0.3&q=80&w=600&auto=format&fit=crop",
    accent: "bg-secondary/10 text-secondary",
  },
  {
    title: "Youth Service",
    time: "Friday 6:30 PM",
    description: "A dynamic service for teenagers to grow in their faith journey.",
    image: "https://images.unsplash.com/photo-1597675985321-b58a36a9f5c8?ixlib=rb-4.0.3&q=80&w=600&auto=format&fit=crop",
    accent: "bg-primary/10 text-primary",
  },
  {
    title: "Bible Study",
    time: "Wednesday 7:00 PM",
    description: "Deepen your understanding of God's Word in an interactive setting.",
    image: "https://images.unsplash.com/photo-1611513933860-05970202a07e?ixlib=rb-4.0.3&q=80&w=600&auto=format&fit=crop",
    accent: "bg-secondary/10 text-secondary",
  },
  {
    title: "Prayer Meeting",
    time: "Tuesday 6:00 AM",
    description: "Join our community in intercession for our church, city, and world.",
    image: "https://images.unsplash.com/photo-1591002455278-18b38fa63b2e?ixlib=rb-4.0.3&q=80&w=600&auto=format&fit=crop",
    accent: "bg-primary/10 text-primary",
  }
];

const ServicesSection = () => {
  return (
    <section className="py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-secondary" />
            <p className="text-secondary font-medium tracking-[0.2em] uppercase text-xs">
              Join Us
            </p>
            <div className="w-10 h-[2px] bg-secondary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Our <span className="text-secondary italic">Services</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join us for worship, prayer, and community as we grow together in faith.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="h-52 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-card-foreground mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  {service.title}
                </h3>
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3 ${service.accent}`}>
                  <Clock className="h-3 w-3" />
                  {service.time}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/services" className="flex items-center gap-2">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
