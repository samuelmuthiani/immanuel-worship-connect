
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, User, Settings, LogOut, Shield, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { MobileMenu } from '@/components/ui/MobileMenu';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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

  // Role-based dropdown configuration
  const getDropdownItems = () => {
    if (!user) return [];
    
    const items = [];
    
    if (isAdmin) {
      items.push({
        path: '/admin',
        label: 'Admin Dashboard',
        icon: Shield,
        description: 'Manage the system'
      });
      items.push({
        path: '/member',
        label: 'Member Area',
        icon: User,
        description: 'View member features'
      });
    } else {
      items.push({
        path: '/member',
        label: 'Member Area',
        icon: User,
        description: 'Your personal area'
      });
    }
    
    return items;
  };

  const dropdownItems = getDropdownItems();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40 transition-colors border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/iwc-logo.png" 
              alt="IWC Logo" 
              className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-iwc-blue dark:text-iwc-orange transition-colors">IWC</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">Immanuel Worship Centre</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map(({ path, label, highlight }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-all duration-200 relative ${
                  isActive(path)
                    ? 'text-iwc-blue dark:text-iwc-orange'
                    : highlight
                    ? 'text-white bg-gradient-to-r from-iwc-orange to-iwc-red hover:from-iwc-red hover:to-iwc-orange px-4 py-2 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    : 'text-gray-700 dark:text-gray-300 hover:text-iwc-blue dark:hover:text-iwc-orange'
                } ${isActive(path) ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-iwc-blue dark:after:bg-iwc-orange after:rounded-full' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* User Menu & Controls */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* User Menu - Desktop */}
            {user ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border border-gray-200 dark:border-gray-700"
                >
                  <div className={`w-8 h-8 ${isAdmin ? 'bg-gradient-to-br from-purple-600 to-iwc-blue' : 'bg-gradient-to-br from-iwc-blue to-iwc-orange'} text-white rounded-full flex items-center justify-center shadow-md`}>
                    {isAdmin ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <span className="hidden xl:block">{user.email?.split('@')[0]}</span>
                  {isAdmin && <span className="hidden xl:block text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full">Admin</span>}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Enhanced User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-fade-in">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{isAdmin ? 'Administrator' : 'Member'}</p>
                    </div>
                    
                    {/* Navigation Items */}
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <item.icon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-iwc-blue dark:group-hover:text-iwc-orange" />
                        <div className="flex flex-col">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
                        </div>
                      </Link>
                    ))}
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      <div className="flex flex-col">
                        <span className="font-medium">Sign Out</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">End your session</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-iwc-blue to-iwc-orange hover:from-iwc-orange hover:to-iwc-red rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
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
