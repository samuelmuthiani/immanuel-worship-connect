// Re-export the main utilities from the new modular files
export {
  saveContactSubmission,
  saveEventRSVP as saveRSVP,
  saveNewsletterSubscription,
  getUserProfile,
  updateUserProfile,
  getAllContactSubmissions,
  getAllEventRegistrations as getAllRSVPs,
  getAllNewsletterSubscribers
} from './supabaseStorage';

export {
  exportToCSV,
  getDashboardAnalytics,
  bulkDeleteItems,
  updateUserRole,
  logAuditAction
} from './adminUtils';

// Keep legacy localStorage functions for backward compatibility
export const saveToLocalStorage = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

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

// Terms and privacy acceptance (non-critical data can remain localStorage)
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
