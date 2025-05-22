import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// NOTE: You must add a 'newsletter_subscribers' table to your Supabase project with at least 'email' (text, unique) and 'subscribed_at' (timestamp) columns.
// After adding the table, update your Supabase types.

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email) {
      try {
        // Save to Supabase newsletter_subscribers table
        const { error: dbError } = await (supabase as any).from('newsletter_subscribers').insert([
          { email, subscribed_at: new Date().toISOString() }
        ]);
        if (dbError) throw dbError;
        // Send notification email to subscriber (stub, replace with real API or Supabase Edge Function)
        try {
          await fetch('/api/send-newsletter-welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
        } catch {}
        setSubmitted(true);
      } catch (err: any) {
        setError('Subscription failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mt-4" aria-label="Newsletter Signup">
      <input
        type="email"
        required
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="px-4 py-2 rounded-md border border-gray-300"
        aria-label="Email address"
        disabled={submitted}
      />
      <button
        type="submit"
        className="bg-iwc-orange hover:bg-iwc-red text-white font-bold px-6 py-2 rounded-md"
        disabled={submitted}
        aria-disabled={submitted}
      >
        {submitted ? "Subscribed!" : "Subscribe"}
      </button>
      {error && <span className="text-red-600 text-sm mt-2">{error}</span>}
    </form>
  );
};

export default NewsletterSignup;
