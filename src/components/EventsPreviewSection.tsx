
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/EventCard';
import { getAllEvents, Event } from '@/utils/eventUtils';
import { useNavigate } from 'react-router-dom';

const EventsPreviewSection = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvents();
      // Show only next 3 upcoming events
      const upcomingEvents = eventsData
        .filter(event => new Date(event.event_date) >= new Date())
        .slice(0, 3);
      setEvents(upcomingEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Events
            </h2>
            <div className="animate-pulse flex space-x-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg flex-1"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Calendar className="h-12 w-12 text-iwc-blue mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join us for our upcoming church events and activities. Experience fellowship, 
            worship, and community together.
          </p>
        </div>

        {events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {events.map((event) => (
                <EventCard key={event.id} event={event} showRegistration={true} />
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={() => navigate('/events')}
                className="bg-iwc-blue hover:bg-iwc-orange text-white px-8 py-3 text-lg"
              >
                View All Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Upcoming Events
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back soon for new events and activities.
            </p>
            <Button
              onClick={() => navigate('/events')}
              variant="outline"
              className="border-iwc-blue text-iwc-blue hover:bg-iwc-blue hover:text-white"
            >
              View All Events
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsPreviewSection;
