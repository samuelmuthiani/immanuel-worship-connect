
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from './security';
import { logger } from '@/lib/logger';

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
    logger.log('Fetching all events...');

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      logger.error('Error fetching events:', error);
      throw error;
    }

    logger.log('Events fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    logger.error('Error fetching events:', error);
    return [];
  }
};

export const getUpcomingEvents = async (): Promise<Event[]> => {
  try {
    logger.log('Fetching upcoming events...');

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    if (error) {
      logger.error('Error fetching upcoming events:', error);
      throw error;
    }

    logger.log('Upcoming events fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    logger.error('Error fetching upcoming events:', error);
    return [];
  }
};

/** Fetch registration counts for given event IDs (public, no PII). */
export const getEventRegistrationCounts = async (eventIds: string[]): Promise<Record<string, number>> => {
  if (eventIds.length === 0) return {};
  try {
    const { data, error } = await (supabase.rpc as any)('get_event_registration_counts', { event_ids: eventIds });
    if (error) {
      logger.error('Error fetching event registration counts:', error);
      return {};
    }
    const map: Record<string, number> = {};
    (data as Array<{ event_id: string; registration_count: number }> || []).forEach((row) => {
      map[row.event_id] = Number(row.registration_count) || 0;
    });
    return map;
  } catch (error) {
    logger.error('Error in getEventRegistrationCounts:', error);
    return {};
  }
};

export const registerForEvent = async (eventId: string, registrationData: {
  name: string;
  email: string;
  phone?: string;
}): Promise<{ success: boolean; data?: EventRegistration; error?: Error | string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const email = SecurityService.sanitizeInput(registrationData.email);
    const rateLimitKey = `event-reg-${eventId}-${email.toLowerCase()}`;
    if (SecurityService.isRateLimited(rateLimitKey, 3, 30 * 60 * 1000)) {
      return { success: false, error: 'Too many attempts. Please try again later.' };
    }

    const insertPayload = {
      event_id: eventId,
      name: SecurityService.sanitizeInput(registrationData.name),
      email,
      phone: registrationData.phone ? SecurityService.sanitizeInput(registrationData.phone) : null as string | null,
      ...(user?.id && { user_id: user.id }),
      is_guest: !user?.id
    };

    logger.log('Registering for event:', eventId);

    // Use blind insert — duplicate is caught by unique constraint
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([insertPayload]);

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'You are already registered for this event.' };
      }
      logger.error('Error registering for event:', error);
      throw error;
    }

    logger.log('Event registration successful');
    return { success: true };
  } catch (error) {
    logger.error('Error registering for event:', error);
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
    logger.error('Error checking registration status:', error);
    return false;
  }
};

export const getAllEventRegistrations = async (): Promise<EventRegistration[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    logger.log('Fetching all event registrations...');

    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events(title, event_date)
      `)
      .order('registered_at', { ascending: false });

    if (error) {
      logger.error('Error fetching event registrations:', error);
      throw error;
    }

    logger.log('Event registrations fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    logger.error('Error fetching event registrations:', error);
    return [];
  }
};

export const getEventRegistrations = async (eventId: string): Promise<EventRegistration[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    logger.log('Fetching registrations for event:', eventId);

    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false });

    if (error) {
      logger.error('Error fetching event registrations:', error);
      throw error;
    }

    logger.log('Event registrations fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    logger.error('Error fetching event registrations:', error);
    return [];
  }
};
