
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock, Heart } from 'lucide-react';

export function EnhancedFooter() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Events', path: '/events' },
    { label: 'Sermons', path: '/sermons' },
    { label: 'Get Involved', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  const ministries = [
    { label: 'Youth Ministry', path: '/services' },
    { label: 'Children\'s Ministry', path: '/services' },
    { label: 'Women\'s Ministry', path: '/services' },
    { label: 'Men\'s Ministry', path: '/services' },
    { label: 'Music Ministry', path: '/services' },
    { label: 'Outreach', path: '/services' },
  ];

  const resources = [
    { label: 'Prayer Requests', path: '/contact' },
    { label: 'Give Online', path: '/donate' },
    { label: 'Member Login', path: '/login' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/iwc-logo.png" 
                alt="IWC Logo" 
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <h3 className="text-xl font-bold">Immanuel Worship Centre</h3>
                <p className="text-gray-400 text-sm">Kilifi, Kenya</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              A community of believers committed to worshipping God, growing in faith, 
              and serving our community with love and compassion.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-iwc-blue hover:bg-iwc-orange rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-iwc-blue hover:bg-iwc-orange rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-iwc-blue hover:bg-iwc-orange rounded-full flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link 
                    to={path} 
                    className="text-gray-300 hover:text-iwc-orange transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Ministries</h4>
            <ul className="space-y-2">
              {ministries.map(({ label, path }) => (
                <li key={label}>
                  <Link 
                    to={path} 
                    className="text-gray-300 hover:text-iwc-orange transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Service Times */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact & Service Times</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-iwc-orange flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>9VC3+4R4, Next To Equity Bank</p>
                  <p>Off Hospital Road, Kilifi Town</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-iwc-orange" />
                <div className="text-sm text-gray-300">
                  <p>0721 923213 / 0719838046</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-iwc-orange" />
                <p className="text-sm text-gray-300">info@immanuelworship.org</p>
              </div>

              <div className="border-t border-gray-700 pt-3 mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-iwc-orange" />
                  <span className="text-sm font-medium">Service Times</span>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Sunday: 9:00 AM & 11:00 AM</p>
                  <p>Wednesday: 7:00 PM</p>
                  <p>Friday Youth: 6:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-2">Stay Connected</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for updates on events, sermons, and community news.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-iwc-blue"
              />
              <button className="px-6 py-2 bg-iwc-blue hover:bg-iwc-orange rounded-md transition-colors text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Immanuel Worship Centre. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-iwc-orange transition-colors">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link to="/terms" className="hover:text-iwc-orange transition-colors">
                Terms of Service
              </Link>
              <span>|</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-red-500" />
                <span>for the Kingdom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
