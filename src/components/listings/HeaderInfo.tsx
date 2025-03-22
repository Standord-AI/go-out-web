"use client";

import { MapPin, Clock } from "lucide-react";

interface HeaderInfoProps {
  title: string;
  location: string;
  duration: string;
}

export function HeaderInfo({ title, location, duration }: HeaderInfoProps) {
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <MapPin className="h-4 w-4 text-red-500" />
        <span>{location}</span>
        <span className="mx-2">•</span>
        <Clock className="h-4 w-4 text-red-500" />
        <span>{duration}</span>
      </div>
    </div>
  );
}
