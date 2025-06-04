
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Calendar, MapPin, Clock, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/ui/back-button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { registerForEvent } from '@/services/eventAPI';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  organizer?: string;
  category?: string;
  registration_required?: boolean;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast({
        title: 'Error',
        description: 'Failed to load event details.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to register for events.',
        variant: 'destructive'
      });
      return;
    }

    if (event?.registration_required) {
      setRegistrationForm({
        name: '',
        email: user.email || '',
        phone: ''
      });
      setShowRegistrationForm(true);
    } else {
      toast({
        title: 'No Registration Required',
        description: 'Just show up! This event doesn\'t require advance registration.',
      });
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event || !user) return;

    if (!registrationForm.name.trim() || !registrationForm.email.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in your name and email address.',
        variant: 'destructive'
      });
      return;
    }

    setRegistering(true);

    try {
      await registerForEvent(event.id, {
        name: registrationForm.name.trim(),
        email: registrationForm.email.trim(),
        phone: registrationForm.phone.trim()
      });

      toast({
        title: 'Registration Successful!',
        description: `You're registered for "${event.title}". We'll send you a confirmation email.`,
      });
      
      setShowRegistrationForm(false);
      setRegistrationForm({ name: '', email: '', phone: '' });
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'There was an error registering for this event.',
        variant: 'destructive'
      });
    } finally {
      setRegistering(false);
    }
  };

  if (!id) {
    return <Navigate to="/events" replace />;
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iwc-blue mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading event details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The event you're looking for doesn't exist.</p>
            <Button onClick={() => window.history.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <BackButton to="/events" />
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="mb-6">
                  {event.category && (
                    <span className="inline-block px-3 py-1 bg-iwc-blue text-white text-sm rounded-full mb-4">
                      {event.category}
                    </span>
                  )}
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {event.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="h-5 w-5 mr-3 text-iwc-blue" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p>
                          {new Date(event.event_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="h-5 w-5 mr-3 text-iwc-blue" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p>
                          {new Date(event.event_date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="h-5 w-5 mr-3 text-iwc-blue" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p>{event.location}</p>
                      </div>
                    </div>
                    
                    {event.organizer && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Users className="h-5 w-5 mr-3 text-iwc-blue" />
                        <div>
                          <p className="font-medium">Organizer</p>
                          <p>{event.organizer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <Button
                    onClick={handleRegister}
                    size="lg"
                    className="w-full md:w-auto bg-iwc-blue hover:bg-iwc-orange text-white font-semibold px-8 py-3"
                  >
                    {event.registration_required ? 'Register Now' : 'Learn More'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Modal */}
        {showRegistrationForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Register for {event.title}
              </h3>
              
              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <Input
                    value={registrationForm.name}
                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
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
                    required
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
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={registering}
                    className="flex-1 bg-iwc-blue hover:bg-iwc-orange"
                  >
                    {registering ? 'Registering...' : 'Register'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventDetails;
