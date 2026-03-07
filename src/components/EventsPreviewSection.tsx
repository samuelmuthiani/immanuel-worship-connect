
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllEvents, Event } from '@/utils/eventUtils';
import { useNavigate } from 'react-router-dom';

import { Skeleton } from '@/components/ui/skeleton';

const EventsPreviewSection = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvents();
        const upcomingEvents = eventsData
          .filter(event => {
            const ts = Date.parse(event.event_date);
            return !Number.isNaN(ts) && ts >= Date.now();
          })
          .slice(0, 3);
        setEvents(upcomingEvents);
      } catch (error) {
        // Error handled silently for preview section
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[2px] bg-secondary" />
              <p className="text-secondary font-medium tracking-[0.2em] uppercase text-xs">
                What's Happening
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Upcoming <span className="text-secondary italic">Events</span>
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
              <div key={i} className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="pt-4 border-t border-border space-y-2">
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventDate = new Date(event.event_date);
              const validDate = !Number.isNaN(eventDate.getTime());
              return (
                <div
                  key={event.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="p-6">
                    {/* Date badge */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="bg-primary/10 text-primary rounded-xl px-4 py-2.5 text-center min-w-[60px]">
                        <div className="text-2xl font-bold leading-none" style={{ fontFamily: 'DM Serif Display, serif' }}>
                          {validDate ? eventDate.getDate() : '--'}
                        </div>
                        <div className="text-xs uppercase tracking-wider mt-1 font-medium">
                          {validDate ? eventDate.toLocaleString('en', { month: 'short' }) : 'TBD'}
                        </div>
                      </div>
                      {event.category && (
                        <span className="text-xs bg-secondary/10 text-secondary px-3 py-1.5 rounded-full font-semibold">
                          {event.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors" style={{ fontFamily: 'DM Serif Display, serif' }}>
                      {event.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-muted-foreground border-t border-border pt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-secondary" />
                        {validDate ? eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Time TBD'}
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
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
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
