
import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import iwcLogo from '/iwc-logo.png';

const GlobalLoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-iwc-blue/90 via-iwc-orange/60 to-iwc-gold/80 dark:from-gray-900 dark:via-gray-900 dark:to-iwc-blue/80">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-iwc-orange/20 rounded-full blur-3xl opacity-60 animate-pulse-glow" style={{transform:'translate(-50%, -50%)'}} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-iwc-blue/30 rounded-full blur-2xl opacity-40 animate-pulse-glow" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center space-y-6">
        <div className="rounded-full p-4 bg-white/70 dark:bg-gray-900/70 shadow-xl animate-float">
          <img src={iwcLogo} alt="Immanuel Worship Centre" className="h-20 w-20 drop-shadow-lg" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            Immanuel Worship Centre
          </h2>
          <p className="text-white/80 text-sm">
            Loading your spiritual home...
          </p>
        </div>
        
        <LoadingSpinner size="lg" className="border-white/30 border-t-white" />
      </div>
    </div>
  );
};

export default GlobalLoadingScreen;
