
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Home, Info, Calendar, Mic, Mail, Heart, User, Shield, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, isAdmin, signOut } = useAuth();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/services', label: 'Services', icon: Settings },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/sermons', label: 'Sermons', icon: Mic },
    { path: '/contact', label: 'Contact', icon: Mail },
    { path: '/donate', label: 'Donate', icon: Heart, highlight: true },
  ];

  const getUserLinks = () => {
    if (!user) return [];
    
    const links = [];
    
    if (isAdmin) {
      links.push({
        path: '/admin',
        label: 'Admin Dashboard',
        icon: Shield,
        description: 'Manage the system'
      });
    }
    
    links.push({
      path: '/member',
      label: 'Member Area',
      icon: User,
      description: isAdmin ? 'View member features' : 'Your personal area'
    });
    
    return links;
  };

  const userLinks = getUserLinks();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img 
                src="/iwc-logo.png" 
                alt="IWC Logo" 
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-lg font-bold text-iwc-blue dark:text-iwc-orange">IWC</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* User Info (if logged in) */}
          {user && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${isAdmin ? 'bg-gradient-to-br from-purple-600 to-iwc-blue' : 'bg-gradient-to-br from-iwc-blue to-iwc-orange'} text-white rounded-full flex items-center justify-center`}>
                  {isAdmin ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{isAdmin ? 'Administrator' : 'Member'}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            {navLinks.map(({ path, label, icon: Icon, highlight }) => (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  highlight
                    ? 'bg-gradient-to-r from-iwc-orange to-iwc-red text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
            
            {/* User-specific links */}
            {userLinks.length > 0 && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
                {userLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className="flex items-start space-x-3 px-4 py-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <link.icon className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <span className="font-medium">{link.label}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{link.description}</p>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <Button
                onClick={() => {
                  onClose();
                  signOut();
                }}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            ) : (
              <Link to="/login" onClick={onClose}>
                <Button className="w-full bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-red text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
