"use client";

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Map from "@/components/Map";

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
  lng,
}: LocationTabProps) {
  const getDirectionsUrl = () => {
    if (googleMapsUrl) return googleMapsUrl;
    return lat && lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          address
        )}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Location</h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-gray-700">{address}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(getDirectionsUrl(), "_blank")}
        >
          Get Directions
        </Button>
      </div>

      {/* Google Maps Embed */}
      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        {lat && lng ? (
          <Map
            center={{ lat, lng }}
            markers={[{ position: { lat, lng }, title: "Event Location" }]}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-muted-foreground font-medium text-center">
              Map preview is not available for this location, but you can still
              get directions.
            </p>
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-sm">
        Map preview may not be available for this location, but you can still
        get directions.
      </p>
    </div>
  );
}
