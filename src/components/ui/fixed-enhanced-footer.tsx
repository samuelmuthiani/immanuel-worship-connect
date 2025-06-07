
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const FixedEnhancedFooter = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Services', href: '/services' },
    { name: 'Upcoming Events', href: '/events' },
    { name: 'Media Gallery', href: '/media' },
    { name: 'Contact Us', href: '/contact' }
  ];

  const ministries = [
    { name: 'Youth Ministry', href: '/youth' },
    { name: 'Children\'s Ministry', href: '/children' },
    { name: 'Women\'s Ministry', href: '/women' },
    { name: 'Men\'s Ministry', href: '/men' },
    { name: 'Music Ministry', href: '/music' }
  ];

  const resources = [
    { name: 'Sermons', href: '/sermons' },
    { name: 'Blog', href: '/blog' },
    { name: 'Prayer Requests', href: '/prayer' },
    { name: 'Online Giving', href: '/donate' },
    { name: 'Member Portal', href: '/member' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-iwc-orange">
              Immanuel Worship Center
            </h3>
            <p className="text-gray-300 mb-4">
              A community of believers dedicated to worship, fellowship, and serving our Lord Jesus Christ.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-300">
                <MapPin className="h-4 w-4 mr-2 text-iwc-blue" />
                <span>9VC3+4R4, Kilifi Town, Kenya</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Phone className="h-4 w-4 mr-2 text-iwc-blue" />
                <span>(254) 123-456-789</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Mail className="h-4 w-4 mr-2 text-iwc-blue" />
                <span>info@iwc.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-iwc-orange">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={`quick-${index}`}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-iwc-blue transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-iwc-orange">Ministries</h4>
            <ul className="space-y-2">
              {ministries.map((ministry, index) => (
                <li key={`ministry-${index}`}>
                  <Link
                    to={ministry.href}
                    className="text-gray-300 hover:text-iwc-blue transition-colors text-sm"
                  >
                    {ministry.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-iwc-orange">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={`resource-${index}`}>
                  <Link
                    to={resource.href}
                    className="text-gray-300 hover:text-iwc-blue transition-colors text-sm"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            {socialLinks.map((social, index) => (
              <a
                key={`social-${index}`}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-iwc-blue transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Immanuel Worship Center. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 justify-center md:justify-end">
              <Link to="/privacy" className="text-gray-400 hover:text-iwc-blue text-xs">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-iwc-blue text-xs">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FixedEnhancedFooter;
