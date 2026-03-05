
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import iwcLogo from '/iwc-logo.png';

const FixedEnhancedFooter = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Services', href: '/services' },
    { name: 'Upcoming Events', href: '/events' },
    { name: 'Media Gallery', href: '/media' },
    { name: 'Contact Us', href: '/contact' }
  ];

  const resources = [
    { name: 'Sermons', href: '/sermons' },
    { name: 'Blog', href: '/blog' },
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
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Church Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={iwcLogo} alt="IWC" className="h-10 w-10" />
              <h3 className="text-xl font-bold" style={{ fontFamily: 'DM Serif Display, serif' }}>
                Immanuel Worship Centre
              </h3>
            </div>
            <p className="text-background/50 text-sm leading-relaxed mb-6">
              A community of believers dedicated to worship, fellowship, and serving our Lord Jesus Christ.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-background/60">
                <MapPin className="h-4 w-4 mr-3 text-secondary flex-shrink-0" />
                <span>9VC3+4R4, Kilifi Town, Kenya</span>
              </div>
              <div className="flex items-center text-sm text-background/60">
                <Phone className="h-4 w-4 mr-3 text-secondary flex-shrink-0" />
                <span>0721 923213</span>
              </div>
              <div className="flex items-center text-sm text-background/60">
                <Mail className="h-4 w-4 mr-3 text-secondary flex-shrink-0" />
                <span>info@immanuelworship.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-6 tracking-widest uppercase text-background/40">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-background/60 hover:text-secondary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-6 tracking-widest uppercase text-background/40">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link to={resource.href} className="text-background/60 hover:text-secondary transition-colors text-sm">
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Info */}
          <div>
            <h4 className="text-sm font-semibold mb-6 tracking-widest uppercase text-background/40">Connect</h4>
            <div className="flex space-x-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary/20 hover:text-secondary transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="bg-background/5 border border-background/10 rounded-xl p-4">
              <p className="text-background/80 text-xs font-semibold mb-2">Service Times</p>
              <div className="text-background/50 text-xs space-y-1">
                <p>Sunday: 9:00 AM & 11:00 AM</p>
                <p>Wednesday: 7:00 PM</p>
                <p>Friday Youth: 6:30 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-xs flex items-center gap-1">
            © {new Date().getFullYear()} Immanuel Worship Centre. Made with <Heart className="h-3 w-3 text-secondary" /> for the Kingdom.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-background/40 hover:text-secondary text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-background/40 hover:text-secondary text-xs transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FixedEnhancedFooter;
