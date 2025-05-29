
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import NewsletterSignup from '@/components/NewsletterSignup';
import TestimonialsSection from '@/components/TestimonialsSection';
import { Calendar, Video, Users, ArrowRight, Play, Book, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [nextServiceTime, setNextServiceTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [latestSermons, setLatestSermons] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate next Sunday service time
  useEffect(() => {
    const calculateNextSundayService = () => {
      const now = new Date();
      const nextSunday = new Date();
      
      // Set to next Sunday 9:00 AM
      nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
      if (now.getDay() === 0 && now.getHours() < 9) {
        // If it's Sunday and before 9 AM, use today
      } else {
        // Otherwise, move to next Sunday
        nextSunday.setDate(nextSunday.getDate() + (nextSunday.getDay() === 0 ? 0 : 7));
      }
      
      nextSunday.setHours(9, 0, 0, 0);
      setNextServiceTime(nextSunday);
    };

    calculateNextSundayService();
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!nextServiceTime) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = nextServiceTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Service time has passed, recalculate next service
        clearInterval(timer);
        setNextServiceTime(prev => {
          const next = new Date(prev?.getTime() || 0);
          next.setDate(next.getDate() + 7); // Next week
          return next;
        });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [nextServiceTime]);

  // Fetch latest sermons and upcoming events
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch upcoming events
        const now = new Date().toISOString();
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .gte('event_date', now)
          .order('event_date', { ascending: true })
          .limit(3);
        
        // Populate with placeholder data if no events found
        const events = eventsData?.length ? eventsData : [
          {
            id: '1',
            title: 'Sunday Worship Service',
            event_date: new Date(nextServiceTime?.getTime() || Date.now()).toISOString(),
            location: 'Main Sanctuary',
            description: 'Join us for a powerful time of worship and the Word.'
          },
          {
            id: '2',
            title: 'Youth Fellowship',
            event_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
            location: 'Youth Hall',
            description: 'An evening of fun, fellowship and spiritual growth for our youth.'
          },
          {
            id: '3',
            title: 'Bible Study',
            event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            location: 'Fellowship Hall',
            description: 'Dive deeper into God\'s Word with our weekly Bible study.'
          }
        ];
        
        // Set events
        setUpcomingEvents(events);

        // For sermons - if we don't have a sermons table yet, use placeholders
        const sermonsPlaceholders = [
          {
            id: '1',
            title: 'Finding Peace in Troubled Times',
            speaker: 'Pastor John Thompson',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
            thumbnail: 'https://images.unsplash.com/photo-1571275293295-43b3cb72e8a7?q=80&w=400',
            duration: '38:24',
            series: 'Faith for Today'
          },
          {
            id: '2',
            title: 'The Power of Prayer',
            speaker: 'Pastor Mary Thompson',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
            thumbnail: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=400',
            duration: '42:15',
            series: 'Spiritual Disciplines'
          },
          {
            id: '3',
            title: 'Walking in God\'s Purpose',
            speaker: 'Pastor Michael Roberts',
            date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
            thumbnail: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=400',
            duration: '45:30',
            series: 'Destiny Series'
          }
        ];

        setLatestSermons(sermonsPlaceholders);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nextServiceTime]);

  return (
    <Layout>
      {/* Hero Section - Full-width with overlay */}
      <section className="relative h-[80vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1600")',
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Welcome to Immanuel Worship Centre
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              A place where faith comes alive through worship, community, and service. 
              Join us as we grow together in Christ's love.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-iwc-orange hover:bg-iwc-red text-white">
                <Link to="/services">
                  Plan Your Visit
                </Link>
              </Button>
              <a href="https://www.youtube.com/channel/your-channel" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                  <Play className="mr-2 h-5 w-5" /> Watch Live
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Service Countdown Timer - Styled as a prominent banner */}
      <section className="bg-iwc-blue text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-1">Next Sunday Service</h2>
              <p className="text-lg opacity-90">
                {nextServiceTime ? (
                  `${nextServiceTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, 
                  ${nextServiceTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                ) : "Loading..."}
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <div className="text-3xl font-bold">{timeRemaining.days}</div>
                <div className="text-xs uppercase tracking-wider">Days</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <div className="text-3xl font-bold">{timeRemaining.hours}</div>
                <div className="text-xs uppercase tracking-wider">Hours</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <div className="text-3xl font-bold">{timeRemaining.minutes}</div>
                <div className="text-xs uppercase tracking-wider">Minutes</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <div className="text-3xl font-bold">{timeRemaining.seconds}</div>
                <div className="text-xs uppercase tracking-wider">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission & Vision</h2>
            <div className="w-24 h-1 bg-iwc-orange mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              To glorify God by making disciples who love God wholeheartedly, grow in
              Christlike maturity, and serve others effectively through vibrant worship,
              biblical teaching, and compassionate outreach.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md flex flex-col items-center text-center transition-colors">
              <div className="bg-iwc-blue/10 p-4 rounded-full mb-6">
                <Calendar className="h-8 w-8 text-iwc-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Weekly Services</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join us for vibrant worship, inspiring messages, and a welcoming community every Sunday at 9:00 AM.
              </p>
              <Link to="/services" className="mt-auto text-iwc-blue dark:text-iwc-orange font-medium flex items-center hover:underline">
                Service Times <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md flex flex-col items-center text-center transition-colors">
              <div className="bg-iwc-orange/10 p-4 rounded-full mb-6">
                <Book className="h-8 w-8 text-iwc-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Bible Study</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Deepen your understanding of God's Word through our weekly Bible studies and small groups.
              </p>
              <Link to="/services" className="mt-auto text-iwc-blue dark:text-iwc-orange font-medium flex items-center hover:underline">
                Learn More <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md flex flex-col items-center text-center transition-colors">
              <div className="bg-iwc-gold/10 p-4 rounded-full mb-6">
                <Users className="h-8 w-8 text-iwc-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Community</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Find belonging in our diverse community through fellowship, events, and ministry opportunities.
              </p>
              <Link to="/about" className="mt-auto text-iwc-blue dark:text-iwc-orange font-medium flex items-center hover:underline">
                Get Involved <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Sermons Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Latest Sermons</h2>
              <div className="w-20 h-1 bg-iwc-orange mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Be inspired by our recent messages</p>
            </div>
            <Link to="/sermons" className="mt-4 md:mt-0 text-iwc-blue dark:text-iwc-orange font-medium flex items-center hover:underline">
              View All Sermons <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-12 text-gray-600 dark:text-gray-400">Loading sermons...</div>
            ) : (
              latestSermons.map((sermon) => (
                <div key={sermon.id} className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img 
                      src={sermon.thumbnail} 
                      alt={sermon.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="default" size="sm" className="bg-iwc-orange hover:bg-iwc-red">
                        <Play className="mr-2 h-4 w-4" /> Watch Now
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {sermon.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-gray-900 dark:text-white">{sermon.title}</h3>
                    <p className="text-iwc-blue dark:text-iwc-orange text-sm mb-2">{sermon.speaker}</p>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{sermon.series}</span>
                      <time dateTime={sermon.date}>
                        {new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Upcoming Events</h2>
              <div className="w-20 h-1 bg-iwc-orange mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Join us for these upcoming gatherings</p>
            </div>
            <Link to="/events" className="mt-4 md:mt-0 text-iwc-blue dark:text-iwc-orange font-medium flex items-center hover:underline">
              View All Events <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-12 text-gray-600 dark:text-gray-400">Loading events...</div>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">{event.title}</h3>
                    <div className="flex items-start mb-3">
                      <Calendar className="h-5 w-5 text-iwc-orange mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(event.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start mb-4">
                      <Video className="h-5 w-5 text-iwc-orange mr-3 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{event.location}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-2">{event.description}</p>
                    <Button className="w-full bg-iwc-blue hover:bg-iwc-orange text-white">
                      Register
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Call to Action */}
      <section className="py-16 px-4 bg-iwc-blue text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're exploring faith or looking for a church home, we'd love to welcome you this Sunday.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-iwc-blue hover:bg-gray-200">
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-iwc-orange hover:bg-iwc-red text-white">
              <Link to="/services">
                Plan Your Visit
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/donate">
                Support Our Mission
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Stay Connected</h2>
          <div className="w-16 h-1 bg-iwc-orange mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Subscribe to our newsletter for updates, upcoming events, and weekly inspiration.
          </p>
          <NewsletterSignup />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
