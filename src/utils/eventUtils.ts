
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from './security';

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  organizer?: string;
  category?: string;
  registration_required?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  registered_at: string;
}

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching all events...');
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    
    console.log('Events fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const getUpcomingEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching upcoming events...');
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
    
    console.log('Upcoming events fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

export const registerForEvent = async (eventId: string, registrationData: {
  name: string;
  email: string;
  phone?: string;
}): Promise<{ success: boolean; data?: EventRegistration; error?: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    // Sanitize inputs
    const sanitizedData = {
      event_id: eventId,
      user_id: user?.id || null,
      name: SecurityService.sanitizeInput(registrationData.name),
      email: SecurityService.sanitizeInput(registrationData.email),
      phone: registrationData.phone ? SecurityService.sanitizeInput(registrationData.phone) : null
    };

    console.log('Registering for event:', eventId, sanitizedData.name);

    // Check for duplicate registration
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', sanitizedData.email)
      .maybeSingle();

    if (existingRegistration) {
      return { 
        success: false, 
        error: 'You are already registered for this event.' 
      };
    }

    const { data, error } = await supabase
      .from('event_registrations')
      .insert([sanitizedData])
      .select()
      .single();
    
    if (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
    
    console.log('Event registration successful:', data.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error registering for event:', error);
    return { success: false, error };
  }
};

export const isUserRegistered = async (eventId: string, email: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', email)
      .maybeSingle();
    
    return !!data;
  } catch (error) {
    console.error('Error checking registration status:', error);
    return false;
  }
};

export const getAllEventRegistrations = async (): Promise<EventRegistration[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

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

export const getEventRegistrations = async (eventId: string): Promise<EventRegistration[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    console.log('Fetching registrations for event:', eventId);
    
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
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
