"use client";

import { FC } from "react";
import ListingCard from "../ListingCard";
import { Listing } from "@/types";

interface CategoryPageProps {
  title: string;
  description: string;
  listings: Listing[];
}

export const CategoryPage: FC<CategoryPageProps> = ({
  title,
  description,
  listings,
}) => {
  return (
    <div className="container mx-auto py-8">
      {/* Hero / Heading Section */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </section>

      {/* Top Experiences */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Top Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              imageSrc={listing.imageSrc}
              altText={listing.title}
              title={listing.title}
              location={listing.location}
              duration={listing.duration}
              price={listing.price}
              isFavorite={false}
              onGiftClick={() => alert(`Booked: ${listing.title}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
