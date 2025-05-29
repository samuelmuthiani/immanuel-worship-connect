
import React from 'react';
import Layout from '@/components/Layout';
import { Heart, Users, BookOpen, Globe, Award, Calendar, MapPin, Clock, Target, Zap, Shield, Crown, TrendingUp } from 'lucide-react';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';

const About = () => {
  const coreValues = [
    {
      icon: Crown,
      title: 'Excellence',
      description: 'We pursue the highest standards in everything we do, reflecting God\'s perfect character through quality worship, teaching, and service that honors His name.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      icon: Heart,
      title: 'Evangelism',
      description: 'We are passionate about sharing the Gospel and making disciples, reaching our community and the world with the transformative message of Jesus Christ.',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: BookOpen,
      title: 'Equipping',
      description: 'We are committed to developing spiritual maturity through biblical teaching, training, and mentorship that prepares every believer for life and ministry.',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Zap,
      title: 'Empowerment',
      description: 'We believe in releasing every person\'s God-given potential through prayer, spiritual gifts, and opportunities to serve in their areas of calling and passion.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: TrendingUp,
      title: 'Expansion',
      description: 'We are called to grow God\'s kingdom through church planting, missions, and strategic partnerships that extend our reach and multiply our impact globally.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const leadership = [
    {
      name: 'Pastor John Thompson',
      role: 'Senior Pastor',
      bio: 'Pastor John has been leading our congregation for over 15 years with passion and dedication to excellence and evangelism.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400'
    },
    {
      name: 'Pastor Mary Thompson',
      role: 'Associate Pastor',
      bio: 'Pastor Mary oversees our children\'s ministry and community outreach programs, embodying our values of equipping and empowerment.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400'
    },
    {
      name: 'Michael Roberts',
      role: 'Youth Pastor',
      bio: 'Michael is passionate about mentoring young people and helping them grow in their faith through excellence and empowerment.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400'
    },
    {
      name: 'Sarah Johnson',
      role: 'Worship Leader',
      bio: 'Sarah leads our worship team with excellence and has a heart for creating meaningful worship experiences that equip and empower.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400'
    }
  ];

  const milestones = [
    { year: '1998', event: 'Church Founded', description: 'Started with 25 members committed to excellence in a small community center' },
    { year: '2005', event: 'New Building', description: 'Moved to our current location, expanding our capacity for evangelism and equipping' },
    { year: '2010', event: 'Youth Ministry Launch', description: 'Established dedicated youth programs focused on empowerment and expansion' },
    { year: '2015', event: 'Community Outreach', description: 'Launched food bank and service initiatives, demonstrating excellence in community care' },
    { year: '2020', event: 'Digital Ministry', description: 'Expanded online presence for global evangelism and virtual equipping' },
    { year: '2023', event: '500+ Members', description: 'Celebrated expansion milestone of over 500 active members and continued growth' }
  ];

  const stats = [
    { number: '500+', label: 'Members', icon: Users },
    { number: '25+', label: 'Years of Excellence', icon: Award },
    { number: '100+', label: 'Weekly Gatherings', icon: Calendar },
    { number: '50+', label: 'Ministries', icon: Heart }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              About Immanuel Worship Centre
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              For over 25 years, Immanuel Worship Centre has been a beacon of hope and faith in our community. 
              We are a diverse family united by our love for God and commitment to serving others with excellence, 
              integrity, and compassion through our five core values.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <EnhancedCard className="bg-gradient-to-br from-iwc-blue/10 to-iwc-orange/10 dark:from-iwc-blue/20 dark:to-iwc-orange/20">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <Target className="mr-3 h-6 w-6 text-iwc-blue" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  To glorify God by making disciples who love God wholeheartedly, grow in Christlike maturity, 
                  and serve others effectively through vibrant worship, biblical teaching, and compassionate outreach. 
                  We pursue excellence in evangelism, equipping believers, empowering ministry, and expanding God's kingdom.
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
                  authentic relationships, transformational worship, and life-changing ministry. We envision 
                  continuous expansion of God's kingdom through excellence in all we do.
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

          {/* Core Values - The Foundation of Who We Are */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
              These five foundational values guide every aspect of our ministry and define who we are as a community of faith.
              They represent our commitment to God's calling and our dedication to transforming lives.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <EnhancedCard key={value.title} className={`text-center group bg-white dark:bg-gray-800 ${value.bgColor} border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700`}>
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 rounded-full bg-white dark:bg-gray-700 shadow-lg group-hover:scale-110 transition-transform">
                        <value.icon className={`h-8 w-8 ${value.color}`} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
              Our Journey of Excellence and Expansion
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
