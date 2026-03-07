import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

export const MemberEvents = () => {
  const { user } = useAuth();

  const { data: registrations, isLoading } = useQuery({
    queryKey: ['user-event-registrations', user?.id],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events (*)
        `)
        .eq('email', user.email)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0 flex flex-col sm:flex-row">
              <div className="w-full sm:w-48 h-32 bg-muted animate-pulse" />
              <div className="p-4 flex-1 space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!registrations || registrations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No upcoming events</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            You haven't registered for any events yet. Check out our upcoming gatherings!
          </p>
          <Link 
            to="/events" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Browse Events
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {registrations.map((reg) => {
        const event = reg.events;
        if (!event) return null;
        
        const eventDate = new Date(event.event_date);
        const isPast = eventDate < new Date();

        return (
          <Card key={reg.id} className={`overflow-hidden transition-all hover:shadow-md ${isPast ? 'opacity-60' : ''}`}>
            <CardContent className="p-0 flex flex-col sm:flex-row">
              <div className="w-full sm:w-48 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-primary">{eventDate.getDate()}</span>
                  <span className="text-xs uppercase font-semibold text-muted-foreground">
                    {eventDate.toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-foreground line-clamp-1">{event.title}</h3>
                    {isPast ? (
                      <Badge variant="outline" className="text-[10px]">Past</Badge>
                    ) : (
                      <Badge className="text-[10px] bg-green-500/10 text-green-600 border-green-200">Upcoming</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1.5 text-primary" />
                      {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1.5 text-primary" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground italic">
                    Registered on {new Date(reg.registered_at).toLocaleDateString()}
                  </span>
                  <Link 
                    to="/events" 
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    View Details <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
