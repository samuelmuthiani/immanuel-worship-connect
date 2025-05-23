
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, Map, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    isPrayerRequest: false
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('site_content')
        .select('content')
        .eq('section', 'contact')
        .single();
      if (!error && data) {
        setContent(data.content || "");
      } else {
        setContent("");
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.isPrayerRequest ? 'Prayer Request' : formData.subject,
          message: formData.message
        }]);

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        isPrayerRequest: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="pt-12 pb-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Contact Us</h1>
            <div className="w-20 h-1 bg-iwc-orange mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We'd love to hear from you! Reach out with questions, prayer requests, or to get involved.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-md flex flex-col items-center text-center">
              <div className="bg-iwc-blue/10 p-4 rounded-full mb-4">
                <Phone className="h-8 w-8 text-iwc-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-3">We're available Monday through Friday</p>
              <p className="font-medium">0721 923213 / 0719838046</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md flex flex-col items-center text-center">
              <div className="bg-iwc-orange/10 p-4 rounded-full mb-4">
                <Mail className="h-8 w-8 text-iwc-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-3">We'll respond to your email within 24 hours</p>
              <p className="font-medium">info@immanuelworship.org</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md flex flex-col items-center text-center">
              <div className="bg-iwc-gold/10 p-4 rounded-full mb-4">
                <Map className="h-8 w-8 text-iwc-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-3">9VC3+4R4, Next To Equity Bank</p>
              <p className="font-medium">Off Hospital Road, Kilifi Town</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                    placeholder="How can we help you?"
                    disabled={formData.isPrayerRequest}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="isPrayerRequest"
                    name="isPrayerRequest"
                    type="checkbox"
                    checked={formData.isPrayerRequest}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-iwc-blue focus:ring-iwc-blue border-gray-300 rounded"
                  />
                  <label htmlFor="isPrayerRequest" className="ml-2 block text-sm text-gray-700">
                    This is a prayer request
                  </label>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-iwc-blue focus:border-transparent"
                    placeholder={formData.isPrayerRequest ? "Share your prayer request here..." : "Your message..."}
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-3 px-6 rounded-md w-full flex items-center justify-center"
                >
                  {submitting ? 'Sending...' : 'Send Message'} 
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>

            <div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <iframe
                  title="Church Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.4615842517483!2d39.85512337561287!3d-3.63833244406098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19f6a670bb7d7e8f%3A0x8b4f2a0dbfb4b1a3!2sEquity%20Bank%20Kilifi%20Branch!5e0!3m2!1sen!2ske!4v1700921784197!5m2!1sen!2ske"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md">
                <h2 className="text-2xl font-bold mb-6">Service Times</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Sunday Morning:</span>
                    <span>9:00 AM & 11:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Wednesday Bible Study:</span>
                    <span>7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Friday Youth Service:</span>
                    <span>6:30 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CMS Content if available */}
          {!loading && content && (
            <div className="mt-16">
              <div className="prose mx-auto max-w-4xl" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
