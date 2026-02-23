
import React from 'react';
import Layout from '@/components/Layout';
import { Heart, Users, BookOpen, Globe, Award, Calendar, MapPin, Clock, Target, Zap, Shield, Crown, TrendingUp } from 'lucide-react';

const About = () => {
  const coreValues = [
    { icon: Crown, title: 'Excellence', description: 'We pursue the highest standards in everything we do, reflecting God\'s perfect character through quality worship, teaching, and service.', color: 'text-yellow-600' },
    { icon: Heart, title: 'Evangelism', description: 'We are passionate about sharing the Gospel, reaching our community and the world with the transformative message of Jesus Christ.', color: 'text-red-500' },
    { icon: BookOpen, title: 'Equipping', description: 'We are committed to developing spiritual maturity through biblical teaching, training, and mentorship.', color: 'text-green-600' },
    { icon: Zap, title: 'Empowerment', description: 'We believe in releasing every person\'s God-given potential through prayer, spiritual gifts, and opportunities to serve.', color: 'text-blue-600' },
    { icon: TrendingUp, title: 'Expansion', description: 'We are called to grow God\'s kingdom through church planting, missions, and strategic partnerships.', color: 'text-purple-600' },
  ];

  const leadership = [
    { name: 'Pastor John Thompson', role: 'Senior Pastor', bio: 'Leading our congregation for over 15 years with passion and dedication.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400' },
    { name: 'Pastor Mary Thompson', role: 'Associate Pastor', bio: 'Oversees children\'s ministry and community outreach programs.', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400' },
    { name: 'Michael Roberts', role: 'Youth Pastor', bio: 'Passionate about mentoring young people in their faith journey.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400' },
    { name: 'Sarah Johnson', role: 'Worship Leader', bio: 'Creates meaningful worship experiences with excellence and heart.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400' },
  ];

  const milestones = [
    { year: '1998', event: 'Church Founded', description: 'Started with 25 members in a small community center' },
    { year: '2005', event: 'New Building', description: 'Moved to our current location in Kilifi Town' },
    { year: '2010', event: 'Youth Ministry Launch', description: 'Established dedicated youth programs' },
    { year: '2015', event: 'Community Outreach', description: 'Launched food bank and service initiatives' },
    { year: '2020', event: 'Digital Ministry', description: 'Expanded online presence for global reach' },
    { year: '2023', event: '500+ Members', description: 'Celebrated milestone of over 500 active members' },
  ];

  const stats = [
    { number: '500+', label: 'Members', icon: Users },
    { number: '25+', label: 'Years', icon: Award },
    { number: '100+', label: 'Gatherings', icon: Calendar },
    { number: '50+', label: 'Ministries', icon: Heart },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">Our Story</p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
            About Immanuel Worship Centre
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            For over 25 years, we've been a beacon of hope and faith in our community — a diverse family united by our love for God.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow">
                <stat.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>{stat.number}</div>
                <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-2xl p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To glorify God by making disciples who love God wholeheartedly, grow in Christlike maturity, and serve others effectively through vibrant worship, biblical teaching, and compassionate outreach.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-6 w-6 text-secondary" />
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To be a thriving, multigenerational church that impacts our community and the world through authentic relationships, transformational worship, and life-changing ministry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">What We Stand For</p>
            <h2 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((v) => (
              <div key={v.title} className="bg-card border border-border rounded-2xl p-8 hover:shadow-md transition-all">
                <v.icon className={`h-8 w-8 ${v.color} mb-4`} />
                <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'DM Serif Display, serif' }}>{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">Our Team</p>
            <h2 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>Meet Our Leadership</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader) => (
              <div key={leader.name} className="text-center group">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-border group-hover:ring-secondary transition-all">
                  <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h3 className="font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>{leader.name}</h3>
                <p className="text-secondary text-sm font-medium mb-2">{leader.role}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">Our History</p>
            <h2 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>Our Journey</h2>
          </div>
          <div className="space-y-6">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-6 items-start">
                <div className="text-2xl font-bold text-secondary min-w-[60px]" style={{ fontFamily: 'DM Serif Display, serif' }}>{m.year}</div>
                <div className="flex-1 bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-foreground mb-1">{m.event}</h3>
                  <p className="text-muted-foreground text-sm">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>Visit Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-8">
            <div className="flex flex-col items-center">
              <MapPin className="h-6 w-6 mb-2 text-secondary" />
              <p className="font-semibold mb-1">Address</p>
              <p className="text-sm text-primary-foreground/70">Off Hospital Road, Kilifi Town</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-6 w-6 mb-2 text-secondary" />
              <p className="font-semibold mb-1">Services</p>
              <p className="text-sm text-primary-foreground/70">Sunday 9AM & 11AM</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-6 w-6 mb-2 text-secondary" />
              <p className="font-semibold mb-1">Contact</p>
              <p className="text-sm text-primary-foreground/70">0721 923213</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
