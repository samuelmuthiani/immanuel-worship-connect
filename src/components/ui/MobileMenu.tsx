
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, Info, Calendar, Headphones, Users, Heart, Phone, User, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const publicLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/services', label: 'Services', icon: Calendar },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/sermons', label: 'Sermons', icon: Headphones },
    { path: '/contact', label: 'Contact', icon: Phone },
    { path: '/donate', label: 'Donate', icon: Heart },
  ];

  const authLinks = user ? [
    { path: '/member', label: 'Member Area', icon: User },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: Settings }] : [])
  ] : [
    { path: '/login', label: 'Login', icon: User }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {/* Public Links */}
          <div className="space-y-1">
            {publicLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-iwc-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t my-4" />

          {/* Auth Links */}
          <div className="space-y-1">
            {authLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-iwc-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
