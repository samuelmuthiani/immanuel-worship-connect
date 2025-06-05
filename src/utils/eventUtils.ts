
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from './security';

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id?: string;
  name: string;
  email: string;
  registered_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  category?: string;
  organizer?: string;
  registration_required?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Register for an event
export const registerForEvent = async (eventId: string, registrationData: {
  name: string;
  email: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Rate limiting
    const clientIP = 'browser-session';
    if (SecurityService.isRateLimited(`event-register-${clientIP}`, 5, 15 * 60 * 1000)) {
      throw new Error('Too many registration attempts. Please wait before trying again.');
    }

    // Sanitize inputs
    const sanitizedData = {
      name: SecurityService.sanitizeInput(registrationData.name),
      email: SecurityService.sanitizeEmail(registrationData.email),
    };

    if (!SecurityService.validateEmail(sanitizedData.email)) {
      throw new Error('Invalid email format');
    }

    if (!sanitizedData.name) {
      throw new Error('Name is required');
    }

    // Validate event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      throw new Error('Event not found');
    }

    // Check if already registered (for authenticated users)
    if (user) {
      const { data: existingRegistration } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingRegistration) {
        throw new Error('You are already registered for this event');
      }
    }

    console.log('Registering for event:', { eventId, ...sanitizedData, userId: user?.id });
    
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        user_id: user?.id || null,
        ...sanitizedData,
        registered_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Supabase error registering for event:', error);
      throw error;
    }
    
    console.log('Event registration successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error registering for event:', error);
    return { success: false, error };
  }
};

// Check if user is registered for an event
export const isUserRegistered = async (eventId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking registration status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking registration status:', error);
    return false;
  }
};

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Get event registrations for admin
export const getAllEventRegistrations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Verify admin access
    const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
    let isAdmin = adminEmails.includes(user.email || '');

    if (!isAdmin) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      isAdmin = roles?.some(r => r.role === 'admin') || false;
    }

    if (!isAdmin) {
      throw new Error('Administrative access required');
    }

    console.log('Fetching all event registrations...');
    
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events(title, event_date)
      `)
      .order('registered_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching event registrations:', error);
      throw error;
    }
    
    console.log('Event registrations fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return [];
  }
};
