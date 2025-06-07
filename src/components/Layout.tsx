
import React from 'react';
import EnhancedNavigation from './EnhancedNavigation';
import FixedEnhancedFooter from './ui/fixed-enhanced-footer';
import { GlobalErrorBoundary } from './ui/GlobalErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <GlobalErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <EnhancedNavigation />
        <main className="flex-1">
          {children}
        </main>
        <FixedEnhancedFooter />
      </div>
    </GlobalErrorBoundary>
  );
};

export default Layout;
