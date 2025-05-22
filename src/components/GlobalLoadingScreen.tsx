import React from 'react';

const GlobalLoadingScreen = () => (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-iwc-blue/90 via-white/90 to-iwc-orange/90 animate-fade-in"
    role="status"
    aria-live="polite"
    aria-label="Loading content"
  >
    {/* Centered logo and spinning rings */}
    <div className="relative flex items-center justify-center w-full h-full min-h-[300px] min-w-[300px]">
      {/* Spinning colored rings around the logo */}
      <span className="absolute w-32 h-32 rounded-full border-4 border-iwc-blue border-t-transparent spin-slow" style={{ animationDuration: '1.8s' }}></span>
      <span className="absolute w-40 h-40 rounded-full border-4 border-iwc-orange border-b-transparent spin-slow-reverse" style={{ animationDuration: '2.4s' }}></span>
      <span className="absolute w-48 h-48 rounded-full border-4 border-iwc-gold border-l-transparent spin-slow" style={{ animationDuration: '2.8s' }}></span>
      {/* Logo with subtle pulsing, centered */}
      <img
        src="/lovable-uploads/ce6f3188-56d4-40eb-9194-1abca3f6a4db.png"
        alt="Immanuel Worship Centre Logo"
        className="w-20 h-20 md:w-24 md:h-24 z-10 animate-pulse"
        style={{ animation: 'logo-spin 2.5s linear infinite alternate' }}
      />
    </div>
    {/* Loading text in bottom left */}
    <span className="fixed left-4 bottom-4 md:left-8 md:bottom-8 text-lg md:text-2xl font-bold text-iwc-blue drop-shadow-lg tracking-wide select-none">
      Loading...
    </span>
    <style>{`
      @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .spin-slow { animation: spin-slow 1.5s linear infinite; }
      @keyframes spin-slow-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      .spin-slow-reverse { animation: spin-slow-reverse 1.5s linear infinite; }
    `}</style>
  </div>
);

export default GlobalLoadingScreen;
