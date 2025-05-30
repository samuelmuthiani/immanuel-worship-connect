
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Heart, Clock, Calendar } from 'lucide-react';
import NewsletterSignup from './NewsletterSignup';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
    { name: 'Donate', href: '/donate' }
  ];

  const servicesTimes = [
    { day: 'Sunday', time: '10:00 AM - 12:00 PM', service: 'Main Service' },
    { day: 'Wednesday', time: '7:00 PM - 8:30 PM', service: 'Bible Study' },
    { day: 'Friday', time: '7:00 PM - 9:00 PM', service: 'Youth Service' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-600' }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white border-t border-gray-800 dark:border-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/iwc-logo.png" 
                alt="IWC Logo" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <h3 className="text-xl font-bold text-white">Immanuel Worship Centre</h3>
                <p className="text-gray-400 text-sm">Building Faith, Strengthening Community</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              A vibrant community dedicated to worship, fellowship, and service. 
              Join us as we grow together in faith and love.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4 pt-2">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`text-gray-400 ${color} transition-colors duration-200 p-2 bg-gray-800 dark:bg-gray-900 rounded-full hover:bg-gray-700 dark:hover:bg-gray-800`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Heart className="h-5 w-5 text-iwc-orange mr-2" />
              Quick Links
            </h4>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-gray-300 hover:text-iwc-orange transition-colors duration-200 text-sm py-1"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Clock className="h-5 w-5 text-iwc-blue mr-2" />
              Service Times
            </h4>
            <div className="space-y-3">
              {servicesTimes.map((service, index) => (
                <div key={index} className="text-sm">
                  <div className="flex items-center text-gray-300 mb-1">
                    <Calendar className="h-4 w-4 text-iwc-gold mr-2" />
                    <span className="font-medium">{service.day}</span>
                  </div>
                  <p className="text-gray-400 ml-6">{service.time}</p>
                  <p className="text-gray-500 ml-6 text-xs">{service.service}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Mail className="h-5 w-5 text-iwc-green mr-2" />
              Get In Touch
            </h4>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-iwc-blue mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>123 Faith Street</p>
                  <p>Nairobi, Kenya</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-iwc-green flex-shrink-0" />
                <a href="tel:+254123456789" className="text-gray-300 hover:text-iwc-green transition-colors">
                  +254 123 456 789
                </a>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-iwc-orange flex-shrink-0" />
                <a href="mailto:info@iwc.org" className="text-gray-300 hover:text-iwc-orange transition-colors">
                  info@iwc.org
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h5 className="text-sm font-medium text-white mb-3">Stay Connected</h5>
              <NewsletterSignup />
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 dark:border-gray-900 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Immanuel Worship Centre. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Built with love and faith for our community.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
