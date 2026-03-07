
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Users, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { registerForEvent, isUserRegistered, Event } from '@/utils/eventUtils';
import { useNavigate } from 'react-router-dom';
import { GlobalErrorBoundary } from '@/components/ui/GlobalErrorBoundary';
import { DataValidation, eventRegistrationSchema } from '@/utils/dataValidation';
import { logger } from '@/lib/logger';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [guestData, setGuestData] = useState({ name: '', email: '', phone: '' });

  const checkRegistrationStatus = useCallback(async () => {
    // Check local storage for guest registration first
    const guestRegKey = `event-reg-${event.id}`;
    const localReg = localStorage.getItem(guestRegKey);
    if (localReg) {
      setIsRegistered(true);
      return;
    }

    if (!user?.email || !showRegistration || !event.registration_required) return;
    
    setCheckingRegistration(true);
    setError(null);
    
    try {
      const registered = await isUserRegistered(event.id, user.email);
      setIsRegistered(registered);
    } catch (error) {
      logger.error('Error checking registration:', error);
      setError('Failed to check registration status');
    } finally {
      setCheckingRegistration(false);
    }
  }, [user?.email, event.id, showRegistration, event.registration_required]);

  useEffect(() => {
    checkRegistrationStatus();
  }, [checkRegistrationStatus]);

  const handleRegister = async (data?: { name: string; email: string; phone?: string }) => {
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

    const registrationData = data || (user ? {
      name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      phone: user.user_metadata?.phone || ''
    } : null);

    if (!registrationData) {
      setIsDialogOpen(true);
      return;
    }

    // Validate registration data
    if (!registrationData.name || !registrationData.email) {
      toast({
        title: 'Validation Error',
        description: 'Name and email are required for registration.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await registerForEvent(event.id, registrationData);

      if (result.success) {
        setIsRegistered(true);
        // Store in local storage for guest tracking
        if (!user) {
          localStorage.setItem(`event-reg-${event.id}`, 'true');
        }
        
        toast({
          title: 'Registration Successful!',
          description: `You have been registered for ${event.title}.`,
        });
        setIsDialogOpen(false);
      } else {
        throw new Error(typeof result.error === 'string' ? result.error : result.error?.message || 'Registration failed');
      }
    } catch (error: unknown) {
      logger.error('Registration error:', error);
      const errorMessage = (error instanceof Error ? error.message : String(error)) || 'Failed to register for event. Please try again.';
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
            <div className="flex flex-col gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => !user && !isRegistered && setIsDialogOpen(true)}
                    disabled={isRegistered || isLoading || checkingRegistration}
                    className={`w-full ${isRegistered ? 'bg-green-500 hover:bg-green-600' : 'bg-iwc-blue hover:bg-iwc-blue/90'} text-white rounded-full py-6 text-lg font-medium shadow-md transition-all active:scale-95`}
                  >
                    {isRegistered ? (
                      <span className="flex items-center">
                        <Check className="h-5 w-5 mr-2" /> Registered
                      </span>
                    ) : isLoading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                      </span>
                    ) : (
                      'Register Now'
                    )}
                  </Button>
                </DialogTrigger>
                {!user && (
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Event Registration</DialogTitle>
                      <DialogDescription>
                        Please provide your details to register for {event.title}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={guestData.name}
                          onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={guestData.email}
                          onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          value={guestData.phone}
                          onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={() => handleRegister(guestData)} 
                        disabled={isLoading}
                        className="bg-iwc-blue hover:bg-iwc-blue/90"
                      >
                        Complete Registration
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
              
              {isRegistered && (
                <p className="text-xs text-center text-green-600 font-medium">
                  You're all set! See you there.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </GlobalErrorBoundary>
  );
};
