
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, User, Settings, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { MobileMenu } from '@/components/ui/MobileMenu';

export function EnhancedNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/events', label: 'Events' },
    { path: '/sermons', label: 'Sermons' },
    { path: '/contact', label: 'Contact' },
    { path: '/donate', label: 'Donate', highlight: true },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/iwc-logo.png" 
              alt="IWC Logo" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-iwc-blue">IWC</span>
              <span className="text-xs text-gray-600 hidden sm:block">Immanuel Worship Centre</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map(({ path, label, highlight }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(path)
                    ? 'text-iwc-blue border-b-2 border-iwc-blue'
                    : highlight
                    ? 'text-white bg-iwc-orange hover:bg-iwc-red px-4 py-2 rounded-md'
                    : 'text-gray-700 hover:text-iwc-blue'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {/* User Menu - Desktop */}
            {user ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-iwc-blue text-white rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden xl:block">{user.email?.split('@')[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/member"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Member Area
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:block px-4 py-2 text-sm font-medium text-white bg-iwc-blue hover:bg-iwc-orange rounded-md transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
}
