
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Calendar, MapPin, Clock, Users, Filter, Search, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { BackButton } from '@/components/ui/back-button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getUpcomingEvents, registerForEvent, isUserRegistered, Event } from '@/utils/eventUtils';

interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [registrationModal, setRegistrationModal] = useState<{open: boolean, event: Event | null}>({
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
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory]);

  useEffect(() => {
    if (user?.email) {
      checkUserRegistrations();
    }
  }, [events, user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getUpcomingEvents();
      
      if (eventsData.length === 0) {
        // Use fallback data if no events in database
        const fallbackEvents = [
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
            title: 'Prayer Breakfast',
            description: 'Start your day with prayer and fellowship. Join us for a morning of spiritual nourishment and community connection.',
            event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Fellowship Hall',
            organizer: 'Prayer Ministry',
            category: 'Prayer',
            registration_required: true
          }
        ];
        setEvents(fallbackEvents);
      } else {
        setEvents(eventsData);
      }
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

  const checkUserRegistrations = async () => {
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
        title: 'Login Recommended',
        description: 'Please log in for easier registration, or continue as guest.',
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
          description: `You're registered for "${registrationModal.event.title}". We'll send you a confirmation email.`,
        });
        setRegistrationModal({ open: false, event: null });
        setRegistrationForm({ name: '', email: '', phone: '' });
        
        // Update registered events
        setRegisteredEvents(prev => new Set([...prev, registrationModal.event!.id]));
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Error registering for event:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'There was an error registering for this event. Please try again.',
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
                    
                    <Button
                      onClick={() => handleRegister(event)}
                      disabled={registeredEvents.has(event.id)}
                      className={`w-full font-semibold ${
                        registeredEvents.has(event.id)
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
            )}
          </div>
        </div>

        {/* Registration Modal */}
        {registrationModal.open && registrationModal.event && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Register for Event
                </h3>
                <Button
                  onClick={closeModal}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {registrationModal.event.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <Input
                    value={registrationForm.name}
                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number (Optional)
                  </label>
                  <Input
                    type="tel"
                    value={registrationForm.phone}
                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
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
