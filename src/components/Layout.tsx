
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import NewsletterSignup from '@/components/NewsletterSignup';
import { supabase } from '@/integrations/supabase/client';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  const navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Events', path: '/events' },
    { name: 'Media', path: '/media' },
    { name: 'Sermons', path: '/sermons' }, // Added Sermons link
    { name: 'Blog', path: '/blog' },
    { name: 'Donate', path: '/donate' },
    { name: 'Contact', path: '/contact' },
    // Removed Terms and Privacy Policy from top navigation
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user && data.user.email_confirmed_at) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/ce6f3188-56d4-40eb-9194-1abca3f6a4db.png" 
              alt="Immanuel Worship Centre Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-iwc-blue">
              Immanuel Worship Centre
            </span>
          </Link>

          {isMobile ? (
            <>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-iwc-blue focus:outline-none"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {mobileMenuOpen && (
                <div className="fixed inset-0 top-[72px] bg-white z-40 animate-fade-in">
                  <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block py-2 text-lg ${
                          isActive(link.path)
                            ? "font-bold text-iwc-orange"
                            : "text-gray-700 hover:text-iwc-orange"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                    {currentUser && (
                      <Link
                        to="/member"
                        className={`block py-2 text-lg ${isActive('/member') ? 'font-bold text-iwc-orange' : 'text-gray-700 hover:text-iwc-orange'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Member
                      </Link>
                    )}
                  </nav>
                </div>
              )}
            </>
          ) : (
            <nav className="flex space-x-6" aria-label="Main navigation">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 transition-colors ${
                    isActive(link.path)
                      ? "font-semibold text-iwc-orange"
                      : "text-gray-700 hover:text-iwc-orange"
                  }`}
                  aria-current={isActive(link.path) ? "page" : undefined}
                >
                  {link.name}
                </Link>
              ))}
              {currentUser && (
                <Link
                  to="/member"
                  className={`py-2 transition-colors ${isActive('/member') ? 'font-semibold text-iwc-orange' : 'text-gray-700 hover:text-iwc-orange'}`}
                  aria-current={isActive('/member') ? 'page' : undefined}
                >
                  Member
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-8" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Immanuel Worship Centre</h3>
              <p className="mb-2">9VC3+4R4, Next To Equity Bank</p>
              <p className="mb-2">Off Hospital Road, Kilifi Town</p>
              <p className="mb-2">info@immanuelworship.org</p>
              <p>0721 923213 / 0719838046</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="hover:text-iwc-gold transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Service Times</h3>
              <p className="mb-2">Sunday: 9:00 AM & 11:00 AM</p>
              <p className="mb-2">Wednesday: 7:00 PM</p>
              <p className="mb-4">Friday: 6:30 PM (Youth Service)</p>
              
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com/yourchurch" target="_blank" rel="noopener noreferrer" className="hover:text-iwc-gold transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="https://twitter.com/yourchurch" target="_blank" rel="noopener noreferrer" className="hover:text-iwc-gold transition-colors" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.162 5.656c-.787.35-1.612.585-2.48.692.892-.534 1.57-1.376 1.892-2.38-.834.494-1.756.85-2.732 1.044C17.99 4.025 16.89 3.5 15.662 3.5c-2.35 0-4.255 1.905-4.255 4.255 0 .34.04.67.117.984-3.536-.177-6.67-1.87-8.764-4.443-.366.627-.576 1.355-.576 2.13 0 1.476.752 2.775 1.89 3.537-.696-.022-1.348-.214-1.92-.53v.053c0 2.056 1.463 3.773 3.404 4.162-.358.098-.734.15-1.12.15-.273 0-.538-.027-.8-.08.54 1.687 2.107 2.914 3.967 2.95-1.46 1.134-3.285 1.81-5.273 1.81-.343 0-.68-.02-1.01-.06 1.88 1.204 4.11 1.908 6.511 1.908 7.812 0 12.09-6.476 12.09-12.09 0-.184-.004-.368-.012-.55.83-.6 1.55-1.348 2.12-2.203z"></path>
                  </svg>
                </a>
                <a href="https://instagram.com/yourchurch" target="_blank" rel="noopener noreferrer" className="hover:text-iwc-gold transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.235.6 1.8 1.164.568.568.914 1.136 1.168 1.804.247.636.416 1.363.465 2.428.048 1.067.06 1.407.06 4.123v.087c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.9 4.9 0 01-1.168 1.804c-.568.568-1.136.914-1.8 1.168-.636.247-1.363.416-2.428.465-1.066.048-1.407.06-4.123.06h-.087c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.9 4.9 0 01-1.804-1.168 4.9 4.9 0 01-1.168-1.804c-.247-.636-.416-1.363-.465-2.428-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.25-.668.6-1.235 1.164-1.8.568-.568 1.136-.914 1.804-1.168.636-.247 1.363-.416 2.428-.465 1.024-.047 1.379-.06 3.808-.06h.63zm-.63 1.8h-.63c-2.376 0-2.7.01-3.728.057-1 .045-1.537.207-1.893.344-.471.182-.807.398-1.15.748-.35.35-.566.688-.748 1.15-.137.356-.3.904-.344 1.893-.047 1.027-.058 1.351-.058 3.727v.63c0 2.376.01 2.7.058 3.727.045 1 .207 1.537.344 1.893.182.471.398.807.748 1.15.35.35.687.566 1.15.748.356.137.904.3 1.893.344 1.027.047 1.351.058 3.728.058h.63c2.376 0 2.7-.01 3.727-.058 1-.045 1.537-.207 1.893-.344.471-.182.807-.398 1.15-.748.35-.35.566-.687.748-1.15.137-.356.3-.904.344-1.893.047-1.027.058-1.351.058-3.727v-.63c0-2.376-.01-2.7-.058-3.727-.045-1-.207-1.537-.344-1.893-.182-.471-.398-.807-.748-1.15-.35-.35-.687-.566-1.15-.748-.356-.137-.904-.3-1.893-.344-1.027-.047-1.351-.058-3.727-.058z"></path>
                    <path d="M12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.8a3.335 3.335 0 100 6.67 3.335 3.335 0 000-6.67z"></path>
                    <circle cx="17.25" cy="6.75" r="1.2"></circle>
                  </svg>
                </a>
                <a href="https://youtube.com/yourchurch" target="_blank" rel="noopener noreferrer" className="hover:text-iwc-gold transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.593 7.203a2.506 2.506 0 00-1.762-1.768C18.265 5.007 12 5 12 5s-6.264-.007-7.831.435a2.505 2.505 0 00-1.766 1.768C2.007 8.769 2 12 2 12s.007 3.23.403 4.797a2.505 2.505 0 001.767 1.768c1.566.44 7.83.437 7.83.437s6.265.003 7.831-.435a2.506 2.506 0 001.767-1.763C21.993 15.23 22 12 22 12s-.007-3.231-.407-4.797zM10 15V9l5.2 3-5.2 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-2">Subscribe to our Newsletter</h4>
            <NewsletterSignup />
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p>&copy; {new Date().getFullYear()} Immanuel Worship Centre. All rights reserved.</p>
            <div className="mt-2">
              {/* Terms and Privacy Policy only in footer, not in top navigation */}
              <Link to="/terms" className="hover:text-iwc-gold mr-4 transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-iwc-gold transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
