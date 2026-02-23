
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllEvents, Event } from '@/utils/eventUtils';
import { useNavigate } from 'react-router-dom';

const EventsPreviewSection = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvents();
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
    fetchEvents();
  }, []);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">
              What's Happening
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Upcoming Events
            </h2>
          </div>
          <Button
            onClick={() => navigate('/events')}
            variant="outline"
            className="rounded-full mt-6 md:mt-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View All Events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventDate = new Date(event.event_date);
              return (
                <div
                  key={event.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="p-6">
                    {/* Date badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary/10 text-primary rounded-xl px-4 py-2 text-center min-w-[60px]">
                        <div className="text-2xl font-bold leading-none" style={{ fontFamily: 'DM Serif Display, serif' }}>
                          {eventDate.getDate()}
                        </div>
                        <div className="text-xs uppercase tracking-wider mt-1">
                          {eventDate.toLocaleString('en', { month: 'short' })}
                        </div>
                      </div>
                      {event.category && (
                        <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                          {event.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors" style={{ fontFamily: 'DM Serif Display, serif' }}>
                      {event.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-secondary" />
                        {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-secondary" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
              No Upcoming Events
            </h3>
            <p className="text-muted-foreground mb-6">Check back soon for new events.</p>
            <Button onClick={() => navigate('/events')} variant="outline" className="rounded-full">
              View All Events
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsPreviewSection;
