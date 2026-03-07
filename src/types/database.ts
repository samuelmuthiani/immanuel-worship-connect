/**
 * Strict TypeScript types for database models (align with Supabase schema).
 * Use for API layer and admin dashboard.
 */

export interface NewsletterSubscriber {
  id: string;
  name?: string;
  email: string;
  consent: boolean;
  created_at: string;
  source_page?: string;
}

export interface PolicyAcceptance {
  id: string;
  user_id: string;
  policy_type: 'terms' | 'privacy';
  accepted_at: string;
}

export interface EventRegistrationRow {
  id: string;
  event_id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  registered_at: string;
  is_guest: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  inquiry_type: string | null;
  submitted_at: string;
  user_id: string | null;
}
