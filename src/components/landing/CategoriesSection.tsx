"use client";

import SectionHeader from "../SectionHeader";
import CategoryCard from "./ProductCard";

interface Category {
  title: string;
  experiences: string;
  image: string;
  endpoint?: string;
}

const categories: Category[] = [
  {
    title: "Day-outs",
    experiences: "60+ experiences",
    image: "/images/day-out.jpg",
    endpoint: "day-outs",
  },
  {
    title: "Adventure Getaways",
    experiences: "40+ experiences",
    image: "/images/adventure-getaway.jpg",
    endpoint: "adventures",
  },
  {
    title: "Romantic Dinner Dates",
    experiences: "30+ experiences",
    image: "/images/dinner-dates.jpg",
    endpoint: "dinner-outs",
  },
  {
    title: "Luxury High Teas",
    experiences: "25+ experiences",
    image: "/images/high-teas.jpg",
    endpoint: "high-teas",
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
          <CategoryCard
            key={index}
            title={category.title}
            experiences={category.experiences}
            image={category.image}
            endpoint={category.endpoint}
          />
        ))}
      </div>
    </section>
  );
}
