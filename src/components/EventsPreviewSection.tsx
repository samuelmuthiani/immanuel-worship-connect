
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];

const EventsPreviewSection = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true })
          .limit(3);
          
        if (error) {
          throw error;
        }
        
        setUpcomingEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="py-16 bg-gray-50">
      <div 
        ref={sectionRef}
        className="container mx-auto px-4 transition-all duration-1000 opacity-0 translate-y-10"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Upcoming Events</h2>
          <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join us for these upcoming events and activities at our church.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-iwc-blue"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{event.title}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <CalendarDays className="h-4 w-4 mr-2 text-iwc-orange" />
                      <span>
                        {format(new Date(event.event_date), 'EEEE, MMMM d - h:mm a')}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <Link 
                      to="/events" 
                      className="text-iwc-blue hover:text-iwc-orange transition-colors flex items-center font-medium"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/events" 
                className="bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-3 px-8 rounded-md transition-colors inline-flex items-center"
              >
                View All Events
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPreviewSection;
