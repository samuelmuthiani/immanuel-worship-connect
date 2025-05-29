
import React from 'react';
import { EnhancedNavigation } from '@/components/EnhancedNavigation';
import { EnhancedFooter } from '@/components/EnhancedFooter';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <EnhancedNavigation />
      
      <main className="flex-1">
        {children}
      </main>
      
      <EnhancedFooter />
      <Toaster />
    </div>
  );
};

export default Layout;
