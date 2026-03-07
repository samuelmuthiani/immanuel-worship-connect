
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Home, Info, Calendar, Mic, Mail, Heart, User, Shield, LogOut, Settings, BookOpen, Image, Church } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, isAdmin, signOut } = useAuth();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/services', label: 'Services', icon: Church },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/media', label: 'Media', icon: Image },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/sermons', label: 'Sermons', icon: Mic },
    { path: '/contact', label: 'Contact', icon: Mail },
    { path: '/donate', label: 'Donate', icon: Heart, highlight: true },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-card border-l border-border shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Menu
            </span>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* User Info */}
          {user && (
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAdmin ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {isAdmin ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground truncate max-w-[180px]">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{isAdmin ? 'Administrator' : 'Member'}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navLinks.map(({ path, label, icon: Icon, highlight }) => (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  highlight
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            
            {user && (
              <>
                <div className="border-t border-border my-3" />
                {isAdmin && (
                  <Link to="/admin" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent">
                    <Shield className="h-4 w-4" /> Admin Dashboard
                  </Link>
                )}
                <Link to="/member?tab=profile" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Settings className="h-4 w-4" /> Member Area
                </Link>
              </>
            )}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-border">
            {user ? (
              <Button onClick={() => { onClose(); signOut(); }} variant="outline" className="w-full rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1 rounded-xl">
                  <Link to="/login" onClick={onClose}>Sign In</Link>
                </Button>
                <Button asChild className="flex-1 rounded-xl bg-primary">
                  <Link to="/register" onClick={onClose}>Join Us</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
