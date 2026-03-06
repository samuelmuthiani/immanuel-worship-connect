
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Check, Send, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from '@/utils/security';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!consent) {
      setError('Please agree to receive newsletter emails.');
      return;
    }

    const rateLimitKey = `newsletter-${email.trim().toLowerCase()}`;
    if (SecurityService.isRateLimited(rateLimitKey, 3, 60 * 60 * 1000)) {
      setError('Too many attempts. Please try again later.');
      return;
    }

    setIsSubmitting(true);

    try {
      const signupTimestamp = new Date().toISOString();
      const sanitizedEmail = SecurityService.sanitizeEmail(email);
      const { error: supabaseError } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email: sanitizedEmail,
          subscribed_at: signupTimestamp,
          consent_status: 'granted'
        }]);

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          throw new Error('This email is already subscribed to our newsletter.');
        }
        throw new Error(supabaseError.message || 'Failed to subscribe to newsletter');
      }

      setIsSubscribed(true);
      setEmail('');
      toast({
        title: 'Successfully Subscribed!',
        description: "Thank you for joining our newsletter. You'll receive updates and inspiration from our community.",
      });
      
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (error: unknown) {
      console.error('Newsletter subscription error:', error);
      const errorMessage = (error instanceof Error ? error.message : String(error)) || 'There was an error subscribing. Please try again.';
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
        <div className="flex flex-col items-center justify-center p-8 bg-secondary/10 rounded-2xl border border-secondary/20">
          <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2 text-center" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Welcome to Our Newsletter!
          </h3>
          <p className="text-muted-foreground text-center text-sm mb-4">
            You're now subscribed and will receive our latest updates, event announcements, and weekly inspiration.
          </p>
          <Button 
            onClick={() => setIsSubscribed(false)}
            variant="outline"
            size="sm"
            className="rounded-full border-secondary/30 text-secondary hover:bg-secondary/10"
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
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-xl"
              />
            </div>
            <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-6 py-2 rounded-xl whitespace-nowrap flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary-foreground" />
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
          <div className="flex items-start gap-2">
            <Checkbox
              id="newsletter-consent"
              checked={consent}
              onCheckedChange={(c) => setConsent(!!c)}
              disabled={isSubmitting}
              className="mt-0.5"
            />
            <label htmlFor="newsletter-consent" className="text-sm text-muted-foreground cursor-pointer">
              I agree to receive newsletters and updates from Immanuel Worship Connect. I can unsubscribe at any time.
            </label>
          </div>
        </div>
      </form>
      <p className="text-xs text-muted-foreground mt-3 text-center">
        We respect your privacy. Unsubscribe at any time. No spam, just inspiration.
      </p>
    </div>
  );
};

export default NewsletterSignup;
