"use client"

import React from 'react';
import { APIProvider, Map as GoogleMap, Marker } from '@vis.gl/react-google-maps';

interface MapProps {
 center?: { lat: number; lng: number };
 markers?: { position: { lat: number; lng: number }; title: string }[];
}

const Map = ({ center, markers }: MapProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key is missing. Please add it to your .env.local file.");
    return <div>Google Maps API key is missing.</div>;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMap
          defaultCenter={center || { lat: 22.54992, lng: 0 }}
          defaultZoom={14}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {markers && markers.map((marker, index) => (
            <Marker key={index} position={marker.position} title={marker.title} />
          ))}
        </GoogleMap>
      </div>
    </APIProvider>
  );
};

export default Map;
