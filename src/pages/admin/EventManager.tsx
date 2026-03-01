
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Save, X, MapPin, Calendar, Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  category: string | null;
  image_url: string | null;
  is_featured: boolean;
  registration_required: boolean;
  created_at: string;
}

const EventManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({});

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
      if (error) throw error;
      return (data as Event[]) || [];
    }
  });

  const saveEventMutation = useMutation({
    mutationFn: async (event: Partial<Event>) => {
      const eventData = {
        title: event.title,
        description: event.description || null,
        event_date: event.event_date,
        end_date: event.end_date || null,
        location: event.location || null,
        category: event.category || null,
        image_url: event.image_url || null,
        is_featured: event.is_featured || false,
        registration_required: event.registration_required || false,
        updated_at: new Date().toISOString(),
      };

      if (event.id) {
        const { error } = await supabase.from('events').update(eventData).eq('id', event.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert([eventData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setIsEditing(false);
      setCurrentEvent({});
      toast({ title: 'Success', description: 'Event saved successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Success', description: 'Event deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleEdit = (event: Event) => {
    setCurrentEvent({
      ...event,
      event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
      end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
    });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentEvent({ is_featured: false, registration_required: false });
    setIsEditing(true);
  };

  const isPast = (dateStr: string) => new Date(dateStr) < new Date();

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-foreground">Events</h2>
          <p className="text-sm text-muted-foreground">{events?.length || 0} total events</p>
        </div>
        {!isEditing && (
          <Button onClick={handleCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" /> New Event
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentEvent.id ? 'Edit Event' : 'Create New Event'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                value={currentEvent.title || ''}
                onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                placeholder="Event title"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-start">Start Date & Time</Label>
                <Input
                  id="event-start"
                  type="datetime-local"
                  value={currentEvent.event_date || ''}
                  onChange={e => setCurrentEvent({ ...currentEvent, event_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="event-end">End Date & Time (Optional)</Label>
                <Input
                  id="event-end"
                  type="datetime-local"
                  value={currentEvent.end_date || ''}
                  onChange={e => setCurrentEvent({ ...currentEvent, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={currentEvent.location || ''}
                  onChange={e => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                  placeholder="e.g. Main Sanctuary"
                />
              </div>
              <div>
                <Label htmlFor="event-category">Category</Label>
                <Select
                  value={currentEvent.category || ''}
                  onValueChange={(value) => setCurrentEvent({ ...currentEvent, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="worship">Worship</SelectItem>
                    <SelectItem value="fellowship">Fellowship</SelectItem>
                    <SelectItem value="outreach">Outreach</SelectItem>
                    <SelectItem value="youth">Youth</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="event-image">Image URL (Optional)</Label>
              <Input
                id="event-image"
                value={currentEvent.image_url || ''}
                onChange={e => setCurrentEvent({ ...currentEvent, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="event-featured"
                checked={currentEvent.is_featured || false}
                onCheckedChange={checked => setCurrentEvent({ ...currentEvent, is_featured: checked })}
              />
              <Label htmlFor="event-featured">Featured Event</Label>
            </div>

            <div>
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={currentEvent.description || ''}
                onChange={e => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                rows={4}
                placeholder="Describe this event..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button
                onClick={() => saveEventMutation.mutate(currentEvent)}
                disabled={!currentEvent.title || !currentEvent.event_date}
              >
                <Save className="mr-2 h-4 w-4" /> Save Event
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {events?.map(event => (
            <Card key={event.id} className={`${isPast(event.event_date) ? 'opacity-60' : ''}`}>
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">{event.title}</h3>
                    {event.is_featured && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" /> Featured
                      </Badge>
                    )}
                    {isPast(event.event_date) && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">Past</Badge>
                    )}
                    {event.category && (
                      <Badge variant="outline" className="text-xs capitalize">{event.category}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm('Delete this event?')) deleteEventMutation.mutate(event.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {events?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No events yet. Create one to get started.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventManager;
