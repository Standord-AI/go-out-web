"use client";

import React from "react";
import SectionHeader from "../SectionHeader";
import ExperienceCard from "../ExperienceCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Experience {
  title: string;
  location: string;
  rating: number;
  price: string;
  image: string;
  duration?: string;
  isFavorite?: boolean;
}

const experiences: Experience[] = [
  {
    title: "Luxury Tea Tasting",
    location: "Nuwara Eliya, Sri Lanka",
    rating: 4.8,
    price: "$45",
    image: "/images/high-teas.jpg",
    duration: "2 hours",
    isFavorite: true,
  },
  {
    title: "Scenic Train Ride",
    location: "Ella, Sri Lanka",
    rating: 4.7,
    price: "$25",
    image: "/images/train-ride.jpg",
    duration: "3 hours",
    isFavorite: false,
  },
  {
    title: "Jungle Safari Adventure",
    location: "Yala National Park, Sri Lanka",
    rating: 4.9,
    price: "$90",
    image: "/images/safari.jpg",
    duration: "4 hours",
    isFavorite: false,
  },
  {
    title: "Beachfront Candlelight Dinner",
    location: "Galle, Sri Lanka",
    rating: 4.6,
    price: "$120",
    image: "/images/beach-dinner.jpg",
    duration: "5 hours",
    isFavorite: true,
  },
  {
    title: "Yala Safari",
    location: "Yala National Park, Sri Lanka",
    rating: 3.5,
    price: "$160",
    image: "/images/safari.jpg",
    duration: "6 hours",
    isFavorite: false,
  },
  {
    title: "Sigiriya Sunrise",
    location: "Sigiriya, Sri Lanka",
    rating: 4.4,
    price: "$220",
    image: "/images/sigiriya.jpg",
    duration: "7 hours",
    isFavorite: false,
  },
  {
    title: "Pinnawala Elephant Orphanage",
    location: "Pinnawala, Sri Lanka",
    rating: 4.9,
    price: "$70",
    image: "/images/elephant.jpg",
    duration: "8 hours",
    isFavorite: false,
  },
  {
    title: "Kandy Cultural Tour",
    location: "Kandy, Sri Lanka",
    rating: 4.7,
    price: "$150",
    image: "/images/temple-of-tooth.jpg",
    duration: "9 hours",
    isFavorite: false,
  },
];

const DiscoverSection = () => {
  return (
    <section className="container mx-auto px-6 py-12 relative">
      {/* Title */}
      <SectionHeader
        title="Explore Some of Our Popular Experiences"
        subtitle="These experiences are curated to make every moment special by the users of GoOut."
      />

      {/* Scrollable Discover Cards */}
      <div className="relative">
        {/* Left gradient overlay */}
        <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none" />

        {/* Scrollable container */}
        <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex space-x-6 ml-6">
            {experiences.map((exp, index) => (
              <ExperienceCard
                key={index}
                title={exp.title}
                location={exp.location}
                duration={exp.duration}
                price={exp.price}
                image={exp.image}
                isFavorite={exp.isFavorite}
              />
            ))}

            {/* "View All" Card */}
            <Card className="w-72 shrink-0 flex flex-col p-0 bg-gray-100 border border-gray-200 mb-4">
              <div className="flex flex-col items-center justify-center gap-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-700 text-center">
                  View All Experiences
                </h3>
                <Link href="/experiences">
                  <Button size="lg" variant="outline">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Right gradient overlay */}
        <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};

export default DiscoverSection;
