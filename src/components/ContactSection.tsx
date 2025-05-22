import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [cmsContent, setCmsContent] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    // Fetch CMS override content if available
    (async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('site_content')
          .select('content')
          .eq('section', 'contact')
          .single();
        if (!error && data && data.content) setCmsContent(data.content);
      } catch {}
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { error: dbError } = await (supabase as any).from('contact_submissions').insert([
        { ...form, submitted_at: new Date().toISOString() }
      ]);
      if (dbError) throw dbError;
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setError('Submission failed. Please try again.');
    }
  };

  return (
    <div className="py-16 bg-gray-50">
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

            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Contact Information</h3>
                  <div className="space-y-4">
                    <p className="flex items-start text-gray-700">
                      <span className="mr-3 mt-1">📍</span>
                      <span>123 Faith Avenue, City, Country 12345</span>
                    </p>
                    <p className="flex items-start text-gray-700">
                      <span className="mr-3 mt-1">📞</span>
                      <span>+1 (123) 456-7890</span>
                    </p>
                    <p className="flex items-start text-gray-700">
                      <span className="mr-3 mt-1">✉️</span>
                      <span>info@immanuelworship.org</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Service Times</h3>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <span className="font-medium">Sunday:</span> 9:00 AM & 11:00 AM
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Wednesday:</span> 7:00 PM
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Friday:</span> 6:30 PM (Youth)
                    </p>
                  </div>
                </div>

                <div>
                  <Link 
                    to="/contact" 
                    className="bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-3 px-8 rounded-md transition-colors inline-block"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              <div className="md:col-span-3 bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Quick Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      id="message"
                      placeholder="Your message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-iwc-orange hover:bg-iwc-red text-white font-bold py-3 px-6 rounded-md transition-colors w-full"
                    disabled={submitted}
                  >
                    {submitted ? 'Message Sent!' : 'Send Message'}
                  </button>
                  {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactSection;
