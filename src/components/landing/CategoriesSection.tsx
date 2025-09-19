"use client";

import SectionHeader from "../SectionHeader";
import CategoryCard from "./ProductCard";

export default function CategoriesSection() {
  // Define the 3 main categories
  const mainCategories = [
    {
      _id: 'activities',
      name: 'Activities',
      slug: 'activities',
      description: 'Discover exciting activities and adventures',
      image: '/images/adventure-getaway.jpg',
      experienceCount: 25
    },
    {
      _id: 'occasions',
      name: 'Occasions',
      slug: 'occasions',
      description: 'Perfect experiences for special occasions',
      image: '/images/romantic-dinners.jpg',
      experienceCount: 18
    },
    {
      _id: 'recipients',
      name: 'Recipients',
      slug: 'recipients',
      description: 'Tailored experiences for different people',
      image: '/images/day-out.jpg',
      experienceCount: 32
    }
  ];

  return (
    <section className="container mx-auto px-6 py-12">
      {/* Title */}
      <SectionHeader
        title="Explore Unique Experiences in Sri Lanka"
        subtitle="Discover and gift unforgettable day-outs, eat-outs, and more crafted to make every moment special."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainCategories.map((category) => (
          <CategoryCard
            key={category._id}
            title={category.name}
            experiences={`${category.experienceCount}+ experiences`}
            image={category.image}
            endpoint={`/experiences/category/${category.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
