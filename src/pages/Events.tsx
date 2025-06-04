import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Calendar, MapPin, Clock, Users, Filter, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { BackButton } from '@/components/ui/back-button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  organizer?: string;
  category?: string;
  registration_required?: boolean;
  created_at?: string;
  updated_at?: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;

      // If no events in database, use placeholder data
      const eventsData = data?.length ? data : [
        {
          id: '1',
          title: 'Sunday Worship Service',
          description: 'Join us for a powerful time of worship, biblical teaching, and fellowship. All are welcome to experience God\'s presence with us.',
          event_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Main Sanctuary',
          organizer: 'Pastor John Thompson',
          category: 'Worship',
          registration_required: false
        },
        {
          id: '2',
          title: 'Youth Fellowship Night',
          description: 'An evening of fun, games, worship, and spiritual growth designed specifically for our youth (ages 13-18).',
          event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Youth Center',
          organizer: 'Michael Roberts',
          category: 'Youth',
          registration_required: true
        },
        {
          id: '3',
          title: 'Community Bible Study',
          description: 'Dive deeper into God\'s Word with our weekly Bible study. This week we\'re exploring the book of Philippians.',
          event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Fellowship Hall',
          organizer: 'Pastor Mary Thompson',
          category: 'Education',
          registration_required: false
        },
        {
          id: '4',
          title: 'Women\'s Ministry Brunch',
          description: 'Join us for a morning of fellowship, encouragement, and delicious food. Guest speaker will share on "Finding Joy in Every Season".',
          event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Fellowship Hall',
          organizer: 'Sarah Johnson',
          category: 'Fellowship',
          registration_required: true
        },
        {
          id: '5',
          title: 'Church Picnic & BBQ',
          description: 'Bring the whole family for our annual church picnic! Games, food, and fun for all ages. Don\'t forget to bring a side dish to share.',
          event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Church Grounds',
          organizer: 'Events Team',
          category: 'Fellowship',
          registration_required: true
        },
        {
          id: '6',
          title: 'Prayer & Worship Night',
          description: 'Join us for an evening dedicated to prayer and worship. Come seeking God\'s presence and interceding for our community.',
          event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Main Sanctuary',
          organizer: 'Worship Team',
          category: 'Worship',
          registration_required: false
        }
      ];

      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  };

  const categories = Array.from(new Set(events.map(e => e.category).filter(Boolean)));

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <BackButton to="/" />
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Upcoming Events
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join us for these upcoming gatherings and grow in fellowship with our community
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
                Loading events...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
                No events found matching your criteria.
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <EnhancedCard 
                  key={event.id} 
                  className="bg-white dark:bg-gray-800 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      {event.category && (
                        <Badge variant="secondary" className="text-xs">
                          {event.category}
                        </Badge>
                      )}
                      {event.registration_required && (
                        <Badge variant="outline" className="text-xs border-iwc-orange text-iwc-orange">
                          Registration Required
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl line-clamp-2 text-gray-900 dark:text-white group-hover:text-iwc-blue dark:group-hover:text-iwc-orange transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2 text-iwc-blue" />
                        <span>
                          {new Date(event.event_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2 text-iwc-blue" />
                        <span>
                          {new Date(event.event_date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 text-iwc-blue" />
                        <span>{event.location}</span>
                      </div>
                      
                      {event.organizer && (
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-2 text-iwc-blue" />
                          <span>Organized by {event.organizer}</span>
                        </div>
                      )}
                    </div>
                    
                    <Link to={`/events/${event.id}`}>
                      <Button className="w-full bg-iwc-blue hover:bg-iwc-orange text-white font-semibold group">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </EnhancedCard>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Events;
