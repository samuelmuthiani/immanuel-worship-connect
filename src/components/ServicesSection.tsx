
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    title: "Sunday Worship",
    time: "9:00 AM & 11:00 AM",
    description: "Join us for a time of vibrant worship, biblical teaching, and community.",
    image: "https://images.unsplash.com/photo-1578944161892-9f7e879ee7dd?ixlib=rb-4.0.3&q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Youth Service",
    time: "Friday 6:30 PM",
    description: "A dynamic service for teenagers to grow in their faith journey.",
    image: "https://images.unsplash.com/photo-1597675985321-b58a36a9f5c8?ixlib=rb-4.0.3&q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Bible Study",
    time: "Wednesday 7:00 PM",
    description: "Deepen your understanding of God's Word in an interactive setting.",
    image: "https://images.unsplash.com/photo-1611513933860-05970202a07e?ixlib=rb-4.0.3&q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Prayer Meeting",
    time: "Tuesday 6:00 AM",
    description: "Join our community in intercession for our church, city, and world.",
    image: "https://images.unsplash.com/photo-1591002455278-18b38fa63b2e?ixlib=rb-4.0.3&q=80&w=600&auto=format&fit=crop"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">
            Join Us
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join us for worship, prayer, and community as we grow together in faith.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-card-foreground mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  {service.title}
                </h3>
                <div className="flex items-center gap-1.5 text-secondary text-sm font-medium mb-3">
                  <Clock className="h-3.5 w-3.5" />
                  {service.time}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
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
