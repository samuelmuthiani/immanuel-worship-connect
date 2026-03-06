
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from '@/utils/security';
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateForm = () => {
    if (!form.name.trim()) { setError('Please enter your name'); return false; }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Please enter a valid email'); return false; }
    if (!form.message.trim() || form.message.length < 10) { setError('Message must be at least 10 characters'); return false; }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const rateLimitKey = 'contact-form';
    if (SecurityService.isRateLimited(rateLimitKey, 5, 15 * 60 * 1000)) {
      setError('Too many submissions. Please try again in 15 minutes.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: SecurityService.sanitizeInput(form.name.trim()),
          email: SecurityService.sanitizeEmail(form.email),
          message: SecurityService.sanitizeInput(form.message.trim()),
          inquiry_type: 'general',
          submitted_at: new Date().toISOString()
        }]);
      if (supabaseError) throw new Error(supabaseError.message);
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
      toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message.';
      setError(msg);
      toast({ title: "Failed to Send", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: 'Call Us', value: '0721 923213 / 0719838046', sub: 'Mon - Fri' },
    { icon: Mail, label: 'Email Us', value: 'info@immanuelworship.org', sub: '24hr response' },
    { icon: MapPin, label: 'Visit Us', value: 'Off Hospital Road, Kilifi Town', sub: 'Next To Equity Bank' },
  ];

  return (
    <section className="py-28 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[2px] bg-secondary" />
              <p className="text-secondary font-medium tracking-[0.2em] uppercase text-xs">
                Get In Touch
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
              We'd love to <span className="text-secondary italic">hear</span> from you
            </h2>
            <p className="text-background/70 text-lg mb-12 leading-relaxed">
              Reach out with any questions, prayer requests, or just to say hello. We're here for you.
            </p>

            <div className="space-y-8">
              {contactInfo.map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/30 transition-colors">
                    <Icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-background">{label}</p>
                    <p className="text-background/80 text-sm">{value}</p>
                    <p className="text-background/50 text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Button asChild variant="outline" className="rounded-full border-background/30 text-background hover:bg-background/10">
                <Link to="/contact" className="flex items-center gap-2">
                  Visit Contact Page <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-background/5 backdrop-blur-sm rounded-2xl border border-background/10 p-8">
            <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>Send a Message</h3>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>Message Sent!</h4>
                <p className="text-background/70">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/20 border border-destructive/30 rounded-xl">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    <span className="text-sm text-destructive">{error}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange} required disabled={loading}
                    className="w-full px-4 py-3.5 bg-background/10 border border-background/20 rounded-xl text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-sm"
                    placeholder="Your name"
                  />
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange} required disabled={loading}
                    className="w-full px-4 py-3.5 bg-background/10 border border-background/20 rounded-xl text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-sm"
                    placeholder="Your email"
                  />
                </div>
                <textarea
                  name="message" value={form.message} onChange={handleChange} required disabled={loading} rows={4}
                  className="w-full px-4 py-3.5 bg-background/10 border border-background/20 rounded-xl text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-sm resize-none"
                  placeholder="Your message"
                />
                <Button
                  type="submit" disabled={loading}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl h-12"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
