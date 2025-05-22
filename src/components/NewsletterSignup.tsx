
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define a type for our newsletter subscriber
type NewsletterSubscriber = {
  email: string;
  subscribed_at?: string;
}

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Use the contact_submissions table since it has the fields we need
      const { data: existingSubscribers, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking subscription:', checkError);
        throw new Error('Error checking subscription status');
      }
      
      if (existingSubscribers) {
        toast({
          title: "Already subscribed",
          description: "This email is already subscribed to our newsletter.",
          variant: "default",
        });
        setSubmitted(true);
        setLoading(false);
        return;
      }
      
      // Insert into contact_submissions table as a newsletter subscription
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([
          { 
            email,
            // No need to specify subscribed_at as it defaults to now()
          }
        ]);
      
      if (insertError) {
        console.error('Newsletter subscription error:', insertError);
        throw insertError;
      }

      // Send welcome email notification (this would typically call an Edge Function)
      try {
        await fetch('/api/send-newsletter-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
      } catch (emailError) {
        console.log('Welcome email could not be sent, but subscription was successful');
      }
      
      setSubmitted(true);
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      });
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        disabled={submitted || loading}
      />
      <button
        type="submit"
        className="bg-iwc-orange hover:bg-iwc-red text-white font-bold px-6 py-2 rounded-md"
        disabled={submitted || loading}
        aria-disabled={submitted || loading}
      >
        {loading ? "Subscribing..." : submitted ? "Subscribed!" : "Subscribe"}
      </button>
    </form>
  );
};

export default NewsletterSignup;
