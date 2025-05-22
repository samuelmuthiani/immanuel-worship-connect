// Simple local storage utility for storing user consent and other data

// Function to save data to localStorage
export const saveToLocalStorage = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Function to get data from localStorage
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

// Specific functions for terms acceptance
export const saveTermsAcceptance = (accepted: boolean): void => {
  saveToLocalStorage('termsAccepted', {
    accepted,
    timestamp: new Date().toISOString()
  });
};

export const getTermsAcceptance = (): { accepted: boolean; timestamp: string | null } => {
  return getFromLocalStorage<{ accepted: boolean; timestamp: string | null }>(
    'termsAccepted',
    { accepted: false, timestamp: null }
  );
};

// Specific functions for privacy policy acceptance
export const savePrivacyAcceptance = (accepted: boolean): void => {
  saveToLocalStorage('privacyAccepted', {
    accepted,
    timestamp: new Date().toISOString()
  });
};

export const getPrivacyAcceptance = (): { accepted: boolean; timestamp: string | null } => {
  return getFromLocalStorage<{ accepted: boolean; timestamp: string | null }>(
    'privacyAccepted',
    { accepted: false, timestamp: null }
  );
};

// Function to save contact form submission (localStorage primary, Supabase TODO)
export const saveContactSubmission = (formData: any): void => {
  // TODO: When Supabase table 'contact_submissions' is available, insert here and fallback to localStorage on error
  // Example:
  // try {
  //   const { error } = await supabase.from('contact_submissions').insert([{ ...formData, submitted_at: new Date().toISOString() }]);
  //   if (!error) return;
  // } catch (err) {}
  const submissions = getFromLocalStorage<any[]>('contactSubmissions', []);
  submissions.push({
    ...formData,
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  });
  saveToLocalStorage('contactSubmissions', submissions);
};

// Function to get all contact form submissions
export const getContactSubmissions = (): any[] => {
  // TODO: When Supabase table 'contact_submissions' is available, fetch from Supabase and fallback to localStorage on error
  // Example:
  // try {
  //   const { data, error } = await supabase.from('contact_submissions').select('*').order('submitted_at', { ascending: false });
  //   if (data) return data;
  // } catch (err) {}
  return getFromLocalStorage<any[]>('contactSubmissions', []);
};

// RSVP storage helpers (localStorage primary, Supabase TODO)
export const saveRSVP = (eventId: string, rsvp: any): void => {
  // TODO: When Supabase table 'event_registrations' is available, insert here and fallback to localStorage on error
  // Example:
  // try {
  //   const { error } = await supabase.from('event_registrations').insert([{ ...rsvp, event_id: eventId, registered_at: new Date().toISOString() }]);
  //   if (!error) return;
  // } catch (err) {}
  const all = getFromLocalStorage<any>('eventRegistrations', {});
  if (!all[eventId]) all[eventId] = [];
  all[eventId].push({ ...rsvp, timestamp: new Date().toISOString() });
  saveToLocalStorage('eventRegistrations', all);
};

export const getAllRSVPs = (): any[] => {
  // TODO: When Supabase table 'event_registrations' is available, fetch from Supabase and fallback to localStorage on error
  // Example:
  // try {
  //   const { data, error } = await supabase.from('event_registrations').select('*').order('registered_at', { ascending: false });
  //   if (data) return data;
  // } catch (err) {}
  const all = getFromLocalStorage<any>('eventRegistrations', {});
  return Object.entries(all).flatMap(([eventId, arr]) =>
    (Array.isArray(arr) ? arr : [arr]).map((r: any) => ({ eventId, ...r }))
  );
};
