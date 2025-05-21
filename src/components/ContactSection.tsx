
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="py-16 bg-gray-50">
      <div 
        ref={sectionRef}
        className="container mx-auto px-4 transition-all duration-1000 opacity-0 translate-y-10"
      >
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
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your name"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Your email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Message subject"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  placeholder="Your message"
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-iwc-orange"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-iwc-orange hover:bg-iwc-red text-white font-bold py-3 px-6 rounded-md transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
