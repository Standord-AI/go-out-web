"use client";

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Map from "@/components/Map"; 
import { useState, useEffect } from "react"

interface LocationTabProps {
  address: string;
  googleMapsUrl?: string;
  lat?: number;
  lng?: number;
}

export function LocationTab({ address, googleMapsUrl, lat, lng }: LocationTabProps) {
  const [mapEmbedUrl, setMapEmbedUrl] = useState<string>("");

  const eventLocation = {
    lat: 6.934024,
    lng: 79.846075
  };

  useEffect(() => {
    if (lat && lng) {
      setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${lat},${lng}`);
    } else if (address) {
      const encodedAddress = encodeURIComponent(address);
      setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`);
    }
  }, [address, lat, lng]);

  const getDirectionsUrl = () => {
    if (googleMapsUrl) return googleMapsUrl;
    return lat && lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Location</h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-gray-700">{address}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.open(getDirectionsUrl(), "_blank")}>
          Get Directions
        </Button>
      </div>

      {/* Google Maps Embed */}
      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        {mapEmbedUrl ? (
          // <iframe
          //   src={mapEmbedUrl}
          //   width="100%"
          //   height="400"
          //   style={{ border: 0 }}
          //   allowFullScreen
          //   loading="lazy"
          //   referrerPolicy="no-referrer-when-downgrade"
          // />
          <Map markers={[{position: eventLocation, title: "Event Location"}]} center={eventLocation}/>
        ) : (
          <p className="text-gray-500 text-center">Map loading...</p>
        )}
      </div>
    </div>
  );
}
