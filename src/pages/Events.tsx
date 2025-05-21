
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarDays, MapPin, User, Tag } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  
  // Get unique categories from events
  const categories = events.length > 0 
    ? ['all', ...new Set(events.map(event => event.category).filter(Boolean) as string[])]
    : ['all'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Could not load events. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  return (
    <Layout>
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Upcoming Events</h1>
            <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join us for these upcoming events and gatherings at Immanuel Worship Centre.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-iwc-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-iwc-blue"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{event.title}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <CalendarDays className="h-4 w-4 mr-2 text-iwc-orange" />
                      <span>
                        {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy - h:mm a')}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-2 text-iwc-orange" />
                      <span>{event.location}</span>
                    </div>
                    
                    {event.organizer && (
                      <div className="flex items-center text-gray-600 mb-3">
                        <User className="h-4 w-4 mr-2 text-iwc-orange" />
                        <span>{event.organizer}</span>
                      </div>
                    )}
                    
                    {event.category && (
                      <div className="flex items-center text-gray-600 mb-4">
                        <Tag className="h-4 w-4 mr-2 text-iwc-orange" />
                        <span>{event.category}</span>
                      </div>
                    )}
                    
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    {event.registration_required && (
                      <button className="bg-iwc-blue hover:bg-iwc-orange text-white font-medium py-2 px-4 rounded-md transition-colors w-full">
                        Register
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No events found for this category. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Events;
