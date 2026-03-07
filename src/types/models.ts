export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'admin' | 'user' | 'member';
  termsAccepted: boolean;
  privacyAccepted: boolean;
  acceptedAt?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  category?: string;
  imageUrl?: string;
  capacity?: number;
  isPublic: boolean;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  isGuest: boolean;
  registeredAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  consent: boolean;
  sourcePage?: string;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiryType: string;
  submittedAt: string;
}
