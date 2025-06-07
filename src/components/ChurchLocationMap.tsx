
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const ChurchLocationMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Church coordinates for 9VC3+4R4, Kilifi Town
  const churchLocation = {
    lat: -3.6300,
    lng: 39.8550,
    address: "9VC3+4R4, Next To Equity Bank, Off Hospital Road, Kilifi Town, Kilifi"
  };

  useEffect(() => {
    // Simple embedded map using OpenStreetMap/Google Maps embed
    if (mapRef.current) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://maps.google.com/maps?q=${churchLocation.lat},${churchLocation.lng}&hl=en&z=15&output=embed`;
      iframe.width = '100%';
      iframe.height = '300';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.loading = 'lazy';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      
      mapRef.current.appendChild(iframe);
    }
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-6 w-6 text-iwc-blue" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Visit Our Church
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Our Location:
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {churchLocation.address}
          </p>
        </div>
        
        <div ref={mapRef} className="w-full h-[300px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://maps.google.com/?q=${churchLocation.lat},${churchLocation.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-iwc-blue hover:bg-iwc-orange text-white px-4 py-2 rounded-md text-center transition-colors"
          >
            Open in Google Maps
          </a>
          <a
            href={`https://waze.com/ul?ll=${churchLocation.lat},${churchLocation.lng}&navigate=yes`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-center transition-colors"
          >
            Open in Waze
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChurchLocationMap;
