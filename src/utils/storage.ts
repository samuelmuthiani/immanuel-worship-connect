
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

// Function to save contact form submission
export const saveContactSubmission = (formData: any): void => {
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
  return getFromLocalStorage<any[]>('contactSubmissions', []);
};
