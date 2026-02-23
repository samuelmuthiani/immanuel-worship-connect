
import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChurchLocationMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  const churchLocation = {
    lat: -3.6300,
    lng: 39.8550,
    address: "9VC3+4R4, Next To Equity Bank, Off Hospital Road, Kilifi Town, Kilifi"
  };

  useEffect(() => {
    if (mapRef.current && mapRef.current.children.length === 0) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://maps.google.com/maps?q=${churchLocation.lat},${churchLocation.lng}&hl=en&z=15&output=embed`;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = 'none';
      iframe.loading = 'lazy';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      mapRef.current.appendChild(iframe);
    }
  }, []);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="h-5 w-5 text-secondary" />
          <h3 className="text-xl font-bold text-card-foreground" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Visit Our Church
          </h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{churchLocation.address}</p>
      </div>
      
      <div ref={mapRef} className="w-full h-[280px] bg-muted" />
      
      <div className="p-4 flex gap-3">
        <Button asChild variant="outline" size="sm" className="flex-1 rounded-full text-sm">
          <a href={`https://maps.google.com/?q=${churchLocation.lat},${churchLocation.lng}`} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-3.5 w-3.5 mr-2" /> Google Maps
          </a>
        </Button>
        <Button asChild variant="outline" size="sm" className="flex-1 rounded-full text-sm">
          <a href={`https://waze.com/ul?ll=${churchLocation.lat},${churchLocation.lng}&navigate=yes`} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-3.5 w-3.5 mr-2" /> Waze
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ChurchLocationMap;
