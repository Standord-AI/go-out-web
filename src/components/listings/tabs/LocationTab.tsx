"use client";

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";

interface LocationTabProps {
  address: string;
  googleMapsUrl?: string; 
  lat?: number; 
  lng?: number;
}

export function LocationTab({ 
  address, 
  googleMapsUrl, 
  lat, 
  lng 
}: LocationTabProps) {
  const [mapUrl, setMapUrl] = useState<string>("");

  useEffect(() => {
    // If we have specific coordinates, use them, otherwise use the address for the map
    if (lat && lng) {
      setMapUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=600x400&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY_HERE`);
    } else if (address) {
      // Encode the address for URL
      const encodedAddress = encodeURIComponent(address);
      setMapUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=14&size=600x400&markers=color:red%7C${encodedAddress}&key=YOUR_API_KEY_HERE`);
    }
  }, [address, lat, lng]);

  // Generate a Google Maps directions link if not provided
  const getDirectionsUrl = () => {
    if (googleMapsUrl) return googleMapsUrl;
    
    if (lat && lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    } else {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-gray-700">{address}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(getDirectionsUrl(), '_blank')}
          >
            Get Directions
          </Button>
        </div>

        {/* Map Container */}
        <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          {mapUrl ? (
            <Image 
              src={mapUrl} 
              alt={`Map showing ${address}`}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized={true} 
              priority
            />
          ) : (
            <p className="text-gray-500">
              Map loading...
            </p>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Note: To fully implement this component, you&apos;ll need to replace &quot;YOUR_API_KEY_HERE&quot; with a valid Google Maps API key
        </div>
      </div>
    </div>
  );
}
