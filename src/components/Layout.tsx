
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
    { name: 'Terms', path: '/terms' },
    { name: 'Privacy', path: '/privacy' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
                  </nav>
                </div>
              )}
            </>
          ) : (
            <nav className="flex space-x-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 transition-colors ${
                    isActive(link.path)
                      ? "font-semibold text-iwc-orange"
                      : "text-gray-700 hover:text-iwc-orange"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Immanuel Worship Centre</h3>
              <p className="mb-2">123 Faith Avenue</p>
              <p className="mb-2">City, Country 12345</p>
              <p className="mb-2">info@immanuelworship.org</p>
              <p>+1 (123) 456-7890</p>
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
                <a href="#" className="hover:text-iwc-gold transition-colors" aria-label="Facebook">FB</a>
                <a href="#" className="hover:text-iwc-gold transition-colors" aria-label="Twitter">TW</a>
                <a href="#" className="hover:text-iwc-gold transition-colors" aria-label="Instagram">IG</a>
                <a href="#" className="hover:text-iwc-gold transition-colors" aria-label="YouTube">YT</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p>&copy; {new Date().getFullYear()} Immanuel Worship Centre. All rights reserved.</p>
            <div className="mt-2">
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
