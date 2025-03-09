"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SectionHeader from "../SectionHeader";

interface Category {
  title: string;
  experiences: string;
  image: string;
}

const categories: Category[] = [
  {
    title: "Day-outs",
    experiences: "60+ experiences",
    image: "/images/day-out.jpg",
  },
  {
    title: "Adventure Getaways",
    experiences: "40+ experiences",
    image: "/images/adventure-getaway.jpg",
  },
  {
    title: "Romantic Dinner Dates",
    experiences: "30+ experiences",
    image: "/images/dinner-dates.jpg",
  },
  {
    title: "Luxury High Teas",
    experiences: "25+ experiences",
    image: "/images/high-teas.jpg",
  },
];

export default function CategoriesSection() {
  return (
    <section className="container mx-auto px-6 py-12">
      {/* Title */}
      <SectionHeader
        title="Explore Unique Experiences in Sri Lanka"
        subtitle="Discover and gift unforgettable day-outs, eat-outs, and more crafted to make every moment special."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-100 p-0"
          >
            <CardContent className="p-0">
              <div className="relative w-full h-48">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-fill"
                  priority
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start p-4">
              <h3 className="text-lg font-semibold">{category.title}</h3>
              <p className="text-sm text-gray-500">{category.experiences}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
