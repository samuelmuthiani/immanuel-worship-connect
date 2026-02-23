
import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const servicesData = [
  { title: "Sunday Worship", time: "9:00 AM & 11:00 AM", description: "Our main worship services feature contemporary worship, biblical teaching, and prayer ministry. Children's church is provided for ages 3-12.", image: "https://images.unsplash.com/photo-1485872304698-0537e003288d?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop" },
  { title: "Youth Service", time: "Friday 6:30 PM", description: "Our dynamic youth ministry offers teens a place to build authentic community, experience God's presence, and grow in their faith.", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop" },
  { title: "Bible Study", time: "Wednesday 7:00 PM", description: "Our midweek service features in-depth Bible teaching, small group discussions, and prayer.", image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop" },
  { title: "Prayer Meeting", time: "Tuesday 6:00 AM", description: "Join us for powerful corporate prayer as we intercede for our church, community, nation, and world.", image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop" },
  { title: "Children's Ministry", time: "Sunday 9:00 AM & 11:00 AM", description: "Age-appropriate teaching, worship, and activities for children from infants through 6th grade.", image: "https://images.unsplash.com/photo-1505377059067-e285a7bac49b?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop" },
  { title: "Small Groups", time: "Various Times", description: "Our small groups meet throughout the week in homes across the city for fellowship, prayer, and biblical discussion.", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop" },
];

const Services = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">Worship With Us</p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>Our Services</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Join us for worship, prayer, and community as we grow together in faith.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servicesData.map((service, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-lg transition-all">
                <div className="h-56 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-card-foreground mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>{service.title}</h2>
                  <div className="flex items-center gap-1.5 text-secondary text-sm font-medium mb-3">
                    <Clock className="h-3.5 w-3.5" />{service.time}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
