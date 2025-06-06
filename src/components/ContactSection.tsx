
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSectionContent } from '@/utils/siteContent';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { TouchFriendlyButton } from '@/components/ui/TouchFriendlyButton';
import { MobileOptimizedForm } from '@/components/ui/MobileOptimizedForm';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [cmsContent, setCmsContent] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      const content = await getSectionContent('contact');
      if (content) setCmsContent(content);
    };
    
    fetchContent();
  }, []);

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!form.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!form.message.trim()) {
      setError('Please enter your message');
      return false;
    }
    if (form.message.length < 10) {
      setError('Message must be at least 10 characters long');
      return false;
    }
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
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Submitting contact form:', form);
      
      const { data, error: supabaseError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          inquiry_type: 'general',
          submitted_at: new Date().toISOString()
        }])
        .select();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error(supabaseError.message || 'Failed to submit contact form');
      }

      console.log('Contact form submitted successfully:', data);
      
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
      
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for your message. We'll get back to you within 24 hours.",
      });

      // Reset success state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
      
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      const errorMessage = error.message || 'Failed to send message. Please try again.';
      setError(errorMessage);
      
      toast({
        title: "Message Failed to Send",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 sm:py-16 bg-gray-50">
      <ResponsiveContainer>
        <div 
          ref={sectionRef}
          className="transition-all duration-1000 opacity-0 translate-y-10 space-y-8 sm:space-y-12"
        >
          {cmsContent ? (
            <div className="prose mx-auto max-w-4xl" dangerouslySetInnerHTML={{ __html: cmsContent }} />
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900">Get In Touch</h2>
                <div className="w-16 sm:w-20 h-1 bg-iwc-orange mx-auto mb-4 sm:mb-6"></div>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                  We'd love to hear from you. Reach out with any questions or prayer requests.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div className="bg-iwc-blue/10 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-iwc-blue" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Call Us</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">Available Monday - Friday</p>
                    <p className="text-sm sm:text-base font-medium">0721 923213 / 0719838046</p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div className="bg-iwc-orange/10 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-iwc-orange" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Email Us</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">We'll respond within 24 hours</p>
                    <p className="text-sm sm:text-base font-medium break-all">info@immanuelworship.org</p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div className="bg-iwc-gold/10 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-iwc-gold" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Visit Us</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">Next To Equity Bank</p>
                    <p className="text-sm sm:text-base font-medium">Off Hospital Road, Kilifi Town</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Contact Form */}
                <Card>
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-xl font-semibold mb-6 text-gray-900">Send us a Message</h3>
                    
                    {submitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h4>
                        <p className="text-green-600">Thank you for your message. We'll get back to you soon.</p>
                      </div>
                    ) : (
                      <MobileOptimizedForm onSubmit={handleSubmit} spacing="normal">
                        {error && (
                          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                            <span className="text-sm text-red-700">{error}</span>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label htmlFor="name" className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">Name</label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Your name"
                              value={form.name}
                              onChange={handleChange}
                              required
                              disabled={loading}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange transition-colors disabled:opacity-50"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">Email</label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              placeholder="Your email"
                              value={form.email}
                              onChange={handleChange}
                              required
                              disabled={loading}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange transition-colors disabled:opacity-50"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">Message</label>
                          <textarea
                            name="message"
                            id="message"
                            placeholder="Your message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            rows={4}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange transition-colors disabled:opacity-50 resize-vertical min-h-[100px]"
                          ></textarea>
                        </div>

                        <TouchFriendlyButton
                          type="submit"
                          disabled={loading}
                          loading={loading}
                          fullWidth
                          className="bg-iwc-orange hover:bg-iwc-red text-white font-bold transition-colors"
                        >
                          {loading ? 'Sending...' : 'Send Message'}
                          <Send className="ml-2 h-4 w-4" />
                        </TouchFriendlyButton>
                      </MobileOptimizedForm>
                    )}
                  </CardContent>
                </Card>

                {/* Service Times & Info */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-iwc-blue mr-3" />
                        <h3 className="text-lg sm:text-xl font-semibold">Service Times</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="font-medium">Sunday Morning:</span>
                          <span>9:00 AM & 11:00 AM</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="font-medium">Wednesday Bible Study:</span>
                          <span>7:00 PM</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="font-medium">Friday Youth:</span>
                          <span>6:30 PM</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <Link 
                      to="/contact" 
                      className="inline-block bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-3 px-6 sm:px-8 rounded-md transition-colors text-sm sm:text-base"
                    >
                      Visit Our Contact Page
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ResponsiveContainer>
    </section>
  );
};

export default ContactSection;
