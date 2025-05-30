
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Check, Send, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Attempting to save newsletter subscription:', email.trim());
      
      // Direct Supabase call with comprehensive error handling
      const { data, error: supabaseError } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email: email.trim(),
          subscribed_at: new Date().toISOString()
        }])
        .select();

      console.log('Supabase response:', { data, error: supabaseError });

      if (supabaseError) {
        console.error('Supabase error details:', {
          code: supabaseError.code,
          message: supabaseError.message,
          details: supabaseError.details,
          hint: supabaseError.hint
        });
        
        // Handle duplicate email
        if (supabaseError.code === '23505') {
          throw new Error('This email is already subscribed to our newsletter.');
        }
        
        throw new Error(supabaseError.message || 'Failed to subscribe to newsletter');
      }

      if (data && data.length > 0) {
        console.log('Successfully subscribed:', data[0]);
        setIsSubscribed(true);
        setEmail('');
        toast({
          title: 'Successfully Subscribed!',
          description: 'Thank you for joining our newsletter. You\'ll receive updates and inspiration from our community.',
        });
        
        // Reset success state after 5 seconds
        setTimeout(() => setIsSubscribed(false), 5000);
      } else {
        throw new Error('Subscription failed - no data returned');
      }
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      const errorMessage = error.message || 'There was an error subscribing to our newsletter. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Subscription Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2 text-center">
            Welcome to Our Newsletter!
          </h3>
          <p className="text-green-700 dark:text-green-300 text-center text-sm mb-4">
            You're now subscribed and will receive our latest updates, event announcements, and weekly inspiration.
          </p>
          <Button 
            onClick={() => setIsSubscribed(false)}
            variant="outline"
            size="sm"
            className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/40"
          >
            Subscribe Another Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-iwc-blue focus:border-iwc-blue"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-iwc-blue hover:bg-iwc-orange text-white font-semibold px-6 py-2 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Subscribing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>
        </div>
      </form>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        We respect your privacy. Unsubscribe at any time. No spam, just inspiration.
      </p>
    </div>
  );
};

export default NewsletterSignup;
