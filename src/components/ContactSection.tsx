
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSectionContent } from '@/utils/siteContent';
import { saveContactSubmission } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/Card';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [cmsContent, setCmsContent] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await saveContactSubmission({
        ...form,
        inquiry_type: 'general'
      });
      
      if (result.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
        toast({
          title: "Message Sent!",
          description: "Thank you for your message. We'll get back to you soon.",
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div 
        ref={sectionRef}
        className="container mx-auto px-4 transition-all duration-1000 opacity-0 translate-y-10"
      >
        {cmsContent ? (
          <div className="prose mx-auto max-w-4xl mb-12" dangerouslySetInnerHTML={{ __html: cmsContent }} />
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Get In Touch</h2>
              <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We'd love to hear from you. Reach out with any questions or prayer requests.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Contact Cards */}
              <Card hover className="text-center">
                <CardContent>
                  <div className="bg-iwc-blue/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-iwc-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                  <p className="text-gray-600 mb-2">Available Monday - Friday</p>
                  <p className="font-medium">0721 923213 / 0719838046</p>
                </CardContent>
              </Card>

              <Card hover className="text-center">
                <CardContent>
                  <div className="bg-iwc-orange/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-iwc-orange" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                  <p className="text-gray-600 mb-2">We'll respond within 24 hours</p>
                  <p className="font-medium">info@immanuelworship.org</p>
                </CardContent>
              </Card>

              <Card hover className="text-center">
                <CardContent>
                  <div className="bg-iwc-gold/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-iwc-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                  <p className="text-gray-600 mb-2">Next To Equity Bank</p>
                  <p className="font-medium">Off Hospital Road, Kilifi Town</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-6 text-gray-900">Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Your name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Your email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">Message</label>
                      <textarea
                        name="message"
                        id="message"
                        placeholder="Your message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange transition-colors"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || submitted}
                      className="w-full bg-iwc-orange hover:bg-iwc-red text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : submitted ? 'Message Sent!' : 'Send Message'}
                      <Send className="ml-2 h-4 w-4" />
                    </button>
                  </form>
                </CardContent>
              </Card>

              {/* Service Times & Info */}
              <div className="space-y-6">
                <Card>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <Clock className="h-6 w-6 text-iwc-blue mr-3" />
                      <h3 className="text-xl font-semibold">Service Times</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Sunday Morning:</span>
                        <span>9:00 AM & 11:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Wednesday Bible Study:</span>
                        <span>7:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Friday Youth:</span>
                        <span>6:30 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Link 
                    to="/contact" 
                    className="inline-block bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-3 px-8 rounded-md transition-colors"
                  >
                    Visit Our Contact Page
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
