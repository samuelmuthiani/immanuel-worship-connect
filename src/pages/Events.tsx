
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Calendar, MapPin, Clock, Users, Filter, Search, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityService } from '@/utils/security';
import { getUpcomingEvents, registerForEvent, isUserRegistered, getEventRegistrationCounts, Event } from '@/utils/eventUtils';

interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
}

const EventSkeleton = () => (
  <EnhancedCard variant="modern" className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm h-full">
    <div className="h-48 w-full bg-muted animate-pulse" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="pt-4 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-10 w-full mt-4 rounded-xl" />
    </CardContent>
  </EnhancedCard>
);

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [registrationModal, setRegistrationModal] = useState<{ open: boolean, event: Event | null }>({
    open: false,
    event: null
  });
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const eventsData = await getUpcomingEvents();
      setEvents(eventsData);
    } catch (error) {
      // Events fetch error handled via toast
      toast({
        title: 'Error',
        description: 'Failed to load events. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const checkUserRegistrations = useCallback(async () => {
    if (!user?.email) return;

    const registered = new Set<string>();
    for (const event of events) {
      if (event.registration_required) {
        const isRegistered = await isUserRegistered(event.id, user.email);
        if (isRegistered) {
          registered.add(event.id);
        }
      }
    }
    setRegisteredEvents(registered);
  }, [events, user?.email]);

  const fetchAttendeeCounts = useCallback(async () => {
    if (events.length === 0) return;
    const ids = events.map(e => e.id);
    const counts = await getEventRegistrationCounts(ids);
    setAttendeeCounts(counts);
  }, [events]);

  const filterEvents = useCallback(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.location || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  useEffect(() => {
    if (user?.email) {
      checkUserRegistrations();
    }
  }, [checkUserRegistrations, user?.email]);

  useEffect(() => {
    fetchAttendeeCounts();
  }, [fetchAttendeeCounts]);

  const handleRegister = (event: Event) => {
    if (!event.registration_required) {
      toast({
        title: 'No Registration Required',
        description: 'Just show up! This event doesn\'t require advance registration.',
      });
      return;
    }

    if (registeredEvents.has(event.id)) {
      toast({
        title: 'Already Registered',
        description: 'You are already registered for this event.',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Guest registration',
        description: 'You can register with your name and email—no account required.',
      });
    }

    setRegistrationModal({ open: true, event });
    setRegistrationForm({
      name: '',
      email: user?.email || '',
      phone: ''
    });
  };

  const handleSubmitRegistration = async () => {
    if (!registrationModal.event) return;

    if (!registrationForm.name.trim() || !registrationForm.email.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in your name and email address.',
        variant: 'destructive'
      });
      return;
    }

    const rateLimitKey = `event-reg-${registrationForm.email.trim().toLowerCase()}`;
    if (SecurityService.isRateLimited(rateLimitKey, 5, 15 * 60 * 1000)) {
      toast({
        title: 'Too many attempts',
        description: 'Please wait before registering again.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerForEvent(registrationModal.event.id, {
        name: registrationForm.name.trim(),
        email: registrationForm.email.trim(),
        phone: registrationForm.phone.trim()
      });

      if (result.success) {
        toast({
          title: 'Registration Successful!',
          description: `You're registered for "${registrationModal.event.title}".`,
        });
        setRegistrationModal({ open: false, event: null });
        setRegistrationForm({ name: '', email: '', phone: '' });

        setRegisteredEvents(prev => {
          const newSet = new Set(prev);
          if (registrationModal.event) {
            newSet.add(registrationModal.event.id);
          }
          return newSet;
        });
      } else {
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : result.error instanceof Error 
            ? result.error.message 
            : 'Registration failed. Please try again.';
        throw new Error(errorMsg);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'There was an error registering for this event. Please try again.';
      toast({
        title: 'Registration Failed',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setRegistrationModal({ open: false, event: null });
    setRegistrationForm({ name: '', email: '', phone: '' });
  };

  const categories = Array.from(new Set(events.map(e => e.category).filter(Boolean)));

  return (
    <Layout>
      <SEO 
        title="Upcoming Events | Immanuel Worship Centre"
        description="Join our upcoming events and gatherings at Immanuel Worship Centre in Kilifi."
      />
      <div className="min-h-screen bg-background transition-colors">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Upcoming Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join us for these upcoming gatherings and grow in fellowship with our community
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-card text-foreground"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <EventSkeleton key={n} />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <EnhancedCard
                  key={event.id}
                  className="bg-card group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      {event.category && (
                        <Badge variant="secondary" className="text-xs">
                          {event.category}
                        </Badge>
                      )}
                      <div className="flex gap-2">
                        {event.registration_required && (
                          <Badge variant="outline" className="text-xs border-iwc-orange text-iwc-orange">
                            Registration Required
                          </Badge>
                        )}
                        {registeredEvents.has(event.id) && (
                          <Badge className="text-xs bg-green-100 text-green-800 border-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Registered
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {event.description && (
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    {event.registration_required && attendeeCounts[event.id] !== undefined && (
                      <p className="text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5 inline mr-1" />
                        {attendeeCounts[event.id]} {attendeeCounts[event.id] === 1 ? 'person' : 'people'} registered
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>
                          {new Date(event.event_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>
                          {new Date(event.event_date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => handleRegister(event)}
                      disabled={registeredEvents.has(event.id)}
                      className={`w-full font-semibold ${registeredEvents.has(event.id)
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-iwc-blue hover:bg-iwc-orange text-white'
                        }`}
                    >
                      {registeredEvents.has(event.id)
                        ? 'Already Registered'
                        : event.registration_required
                          ? 'Register Now'
                          : 'Learn More'
                      }
                    </Button>
                  </CardContent>
                </EnhancedCard>
              ))
            }
            </div>
          ) : (
            <div className="text-center py-20 bg-card/30 backdrop-blur-sm rounded-3xl border border-border/50">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground max-w-md mx-auto px-4">
                We couldn't find any events matching your current search or filter criteria. Try adjusting your filters.
              </p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-full px-8"
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Registration Modal */}
        {registrationModal.open && registrationModal.event && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {user ? 'Register for Event' : 'Register as Guest'}
                </h3>
                <Button onClick={closeModal} variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-4 p-3 bg-muted rounded-md">
                <h4 className="font-medium text-foreground">
                  {registrationModal.event.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(registrationModal.event.event_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                  <Input
                    value={registrationForm.name}
                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email Address *</label>
                  <Input
                    type="email"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone Number (Optional)</label>
                  <Input
                    type="tel"
                    value={registrationForm.phone}
                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={closeModal} variant="outline" className="flex-1">Cancel</Button>
                <Button
                  onClick={handleSubmitRegistration}
                  disabled={isSubmitting}
                  className="flex-1 bg-iwc-blue hover:bg-iwc-orange text-white"
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Events;
