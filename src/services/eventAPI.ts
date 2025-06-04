
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from '@/utils/security';

export class EventAPIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'EventAPIError';
  }
}

// Get current authenticated user
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new EventAPIError(error.message);
  if (!user) throw new EventAPIError('User not authenticated');
  return user;
};

// Event registration with user authentication
export const registerForEvent = async (eventId: string, registrationData: {
  name: string;
  email: string;
  phone?: string;
}) => {
  try {
    const user = await getCurrentUser();

    // Validate inputs
    if (!eventId || !registrationData.name || !registrationData.email) {
      throw new EventAPIError('Missing required registration information');
    }

    // Sanitize inputs
    const sanitizedData = {
      name: SecurityService.sanitizeInput(registrationData.name),
      email: SecurityService.sanitizeEmail(registrationData.email),
      phone: registrationData.phone ? SecurityService.sanitizeInput(registrationData.phone) : null
    };

    if (!SecurityService.validateEmail(sanitizedData.email)) {
      throw new EventAPIError('Invalid email format');
    }

    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      throw new EventAPIError('Event not found');
    }

    // Register for event
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
      }])
      .select();

    if (error) {
      if (error.code === '23505') {
        throw new EventAPIError('You are already registered for this event');
      }
      throw new EventAPIError(error.message);
    }

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Event registration error:', error);
    throw error;
  }
};

// Get user's event registrations
export const getUserEventRegistrations = async () => {
  try {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events(title, event_date, location)
      `)
      .eq('email', user.email)
      .order('registered_at', { ascending: false });

    if (error) throw new EventAPIError(error.message);
    return data || [];
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return [];
  }
};

// Get all events with registration counts (for admin)
export const getEventsWithRegistrations = async () => {
  try {
    const user = await getCurrentUser();
    
    // Check admin access
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
      throw new EventAPIError('Administrative access required');
    }

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_registrations(count)
      `)
      .order('event_date', { ascending: true });

    if (error) throw new EventAPIError(error.message);
    return data || [];
  } catch (error) {
    console.error('Error fetching events with registrations:', error);
    return [];
  }
};
