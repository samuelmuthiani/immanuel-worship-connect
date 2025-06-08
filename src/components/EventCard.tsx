
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { registerForEvent, isUserRegistered, Event } from '@/utils/eventUtils';
import { useNavigate } from 'react-router-dom';
import { GlobalErrorBoundary } from '@/components/ui/GlobalErrorBoundary';
import { DataValidation, eventRegistrationSchema } from '@/utils/dataValidation';

interface EventCardProps {
  event: Event;
  showRegistration?: boolean;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  showRegistration = true,
  className = '' 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkRegistrationStatus = useCallback(async () => {
    if (!user?.email || !showRegistration || !event.registration_required) return;
    
    setCheckingRegistration(true);
    setError(null);
    
    try {
      const registered = await isUserRegistered(event.id, user.email);
      setIsRegistered(registered);
    } catch (error) {
      console.error('Error checking registration:', error);
      setError('Failed to check registration status');
    } finally {
      setCheckingRegistration(false);
    }
  }, [user?.email, event.id, showRegistration, event.registration_required]);

  useEffect(() => {
    checkRegistrationStatus();
  }, [checkRegistrationStatus]);

  const handleRegister = async () => {
    if (!event.registration_required) {
      toast({
        title: 'No Registration Required',
        description: 'Just show up! This event doesn\'t require advance registration.',
      });
      return;
    }

    if (isRegistered) {
      toast({
        title: 'Already Registered',
        description: 'You are already registered for this event.',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to register for events.',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    const registrationData = {
      name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      phone: user.user_metadata?.phone || ''
    };

    // Validate registration data with proper type guard
    const validation = await DataValidation.validateAndSanitize(registrationData, eventRegistrationSchema);
    if (!validation.success) {
      toast({
        title: 'Validation Error',
        description: validation.errors.join(', '),
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Type guard ensures we have validated data
      const validatedData = validation.data;
      if (!validatedData.name || !validatedData.email) {
        throw new Error('Name and email are required');
      }

      const result = await registerForEvent(event.id, {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone
      });

      if (result.success) {
        setIsRegistered(true);
        toast({
          title: 'Registration Successful!',
          description: `You have been registered for ${event.title}.`,
        });
        
        // Refresh registration status
        await checkRegistrationStatus();
      } else {
        throw new Error(result.error?.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Failed to register for event. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date TBD';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Time TBD';
    }
  };

  return (
    <GlobalErrorBoundary>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
              {event.title}
            </h3>
            {event.category && (
              <span className="px-2 py-1 text-xs font-medium bg-iwc-blue/10 text-iwc-blue rounded-full">
                {event.category}
              </span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {event.description}
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2 text-iwc-blue" />
              <span>{formatDate(event.event_date)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2 text-iwc-blue" />
              <span>{formatTime(event.event_date)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2 text-iwc-blue" />
              <span>{event.location}</span>
            </div>

            {event.organizer && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 mr-2 text-iwc-blue" />
                <span>Organized by {event.organizer}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {showRegistration && (
            <div className="flex items-center justify-between">
              {user ? (
                <Button
                  onClick={handleRegister}
                  disabled={isLoading || checkingRegistration || (event.registration_required && isRegistered)}
                  className={`
                    ${isRegistered && event.registration_required
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-iwc-blue hover:bg-iwc-orange'
                    } 
                    text-white transition-colors duration-200
                  `}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registering...
                    </>
                  ) : checkingRegistration ? (
                    'Checking...'
                  ) : isRegistered && event.registration_required ? (
                    '✓ Registered'
                  ) : event.registration_required ? (
                    'Register Now'
                  ) : (
                    'Learn More'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-iwc-blue hover:bg-iwc-orange text-white"
                >
                  Login to Register
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </GlobalErrorBoundary>
  );
};
