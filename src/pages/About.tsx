
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Heart, Users, BookOpen, Globe, Award, Calendar, MapPin, Clock } from 'lucide-react';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { BackButton } from '@/components/ui/back-button';
import { getSectionContent } from '@/utils/siteContent';

const About = () => {
  const [cmsContent, setCmsContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const content = await getSectionContent('about');
      if (content) setCmsContent(content);
    };
    
    fetchContent();
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'Love',
      description: 'We believe in the transformative power of God\'s love and strive to share that love with everyone we meet.',
      color: 'text-red-500'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We are stronger together. Our church family supports one another through all of life\'s seasons.',
      color: 'text-blue-500'
    },
    {
      icon: BookOpen,
      title: 'Scripture',
      description: 'The Bible is our guide for life and faith. We are committed to teaching and living by God\'s Word.',
      color: 'text-green-500'
    },
    {
      icon: Globe,
      title: 'Mission',
      description: 'We are called to serve our community and share the Gospel both locally and around the world.',
      color: 'text-purple-500'
    }
  ];

  const leadership = [
    {
      name: 'Pastor John Thompson',
      role: 'Senior Pastor',
      bio: 'Pastor John has been leading our congregation for over 15 years with passion and dedication.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400'
    },
    {
      name: 'Pastor Mary Thompson',
      role: 'Associate Pastor',
      bio: 'Pastor Mary oversees our children\'s ministry and community outreach programs.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400'
    },
    {
      name: 'Michael Roberts',
      role: 'Youth Pastor',
      bio: 'Michael is passionate about mentoring young people and helping them grow in their faith.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400'
    },
    {
      name: 'Sarah Johnson',
      role: 'Worship Leader',
      bio: 'Sarah leads our worship team and has a heart for creating meaningful worship experiences.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400'
    }
  ];

  const milestones = [
    { year: '1998', event: 'Church Founded', description: 'Started with 25 members in a small community center' },
    { year: '2005', event: 'New Building', description: 'Moved to our current location on Faith Street' },
    { year: '2010', event: 'Youth Ministry Launch', description: 'Established dedicated youth programs and facilities' },
    { year: '2015', event: 'Community Outreach', description: 'Launched food bank and community service initiatives' },
    { year: '2020', event: 'Digital Ministry', description: 'Expanded online presence and virtual services' },
    { year: '2023', event: '500+ Members', description: 'Celebrated reaching over 500 active members' }
  ];

  const stats = [
    { number: '500+', label: 'Members', icon: Users },
    { number: '25+', label: 'Years of Service', icon: Award },
    { number: '100+', label: 'Weekly Gatherings', icon: Calendar },
    { number: '50+', label: 'Ministries', icon: Heart }
  ];

  if (cmsContent) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <BackButton to="/" />
            <div className="prose prose-lg max-w-4xl mx-auto dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: cmsContent }} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <BackButton to="/" />
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              About Immanuel Worship Centre
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              For over 25 years, Immanuel Worship Centre has been a beacon of hope and faith in our community. 
              We are a diverse family united by our love for God and commitment to serving others with excellence, 
              integrity, and compassion.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <EnhancedCard className="bg-gradient-to-br from-iwc-blue/10 to-iwc-orange/10 dark:from-iwc-blue/20 dark:to-iwc-orange/20">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <Heart className="mr-3 h-6 w-6 text-iwc-blue" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  To glorify God by making disciples who love God wholeheartedly, grow in Christlike maturity, 
                  and serve others effectively through vibrant worship, biblical teaching, and compassionate outreach.
                </p>
              </CardContent>
            </EnhancedCard>

            <EnhancedCard className="bg-gradient-to-br from-iwc-orange/10 to-iwc-gold/10 dark:from-iwc-orange/20 dark:to-iwc-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <Globe className="mr-3 h-6 w-6 text-iwc-orange" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  To be a thriving, multigenerational church that impacts our community and the world through 
                  authentic relationships, transformational worship, and life-changing ministry.
                </p>
              </CardContent>
            </EnhancedCard>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <EnhancedCard key={stat.label} className="text-center bg-white dark:bg-gray-800 group">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-3">
                    <stat.icon className="h-10 w-10 text-iwc-blue group-hover:text-iwc-orange transition-colors" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</div>
                </CardContent>
              </EnhancedCard>
            ))}
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <EnhancedCard key={value.title} className="text-center group bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <value.icon className={`h-12 w-12 ${value.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>

          {/* Leadership Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Meet Our Leadership
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {leadership.map((leader, index) => (
                <EnhancedCard key={leader.name} className="text-center group bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="relative mb-4 mx-auto w-32 h-32 rounded-full overflow-hidden">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{leader.name}</h3>
                    <p className="text-iwc-blue dark:text-iwc-orange text-sm font-medium mb-3">{leader.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {leader.bio}
                    </p>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>

          {/* History Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Our Journey
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-iwc-blue dark:bg-iwc-orange"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <EnhancedCard className="bg-white dark:bg-gray-800">
                        <CardContent className="p-6">
                          <div className="text-2xl font-bold text-iwc-blue dark:text-iwc-orange mb-2">
                            {milestone.year}
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                            {milestone.event}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </EnhancedCard>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-iwc-orange rounded-full border-4 border-white dark:border-gray-900"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <EnhancedCard className="bg-gradient-to-r from-iwc-blue to-iwc-orange text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <MapPin className="h-8 w-8 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Address</h3>
                  <p className="text-sm opacity-90">
                    123 Faith Street<br />
                    Cityville, ST 12345
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="h-8 w-8 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Service Times</h3>
                  <p className="text-sm opacity-90">
                    Sunday: 9:00 AM & 11:00 AM<br />
                    Wednesday: 7:00 PM
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="h-8 w-8 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Connect</h3>
                  <p className="text-sm opacity-90">
                    (555) 123-4567<br />
                    info@iwc.org
                  </p>
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        </div>
      </div>
    </Layout>
  );
};

export default About;
