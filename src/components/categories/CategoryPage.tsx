"use client";

import { FC } from "react";
import ListingCard from "../ListingCard";
import { Listing } from "@/types";
import Image from "next/image";

interface CategoryPageProps {
  title: string;
  description: string;
  image: string;
  results: number;
  listings: Listing[];
  loading: boolean;
}

export const CategoryPage: FC<CategoryPageProps> = ({
  title,
  description,
  image,
  results,
  listings,
  loading,
}) => {
  return (
    <div className="container mx-auto py-8">
      {/* Image Banner */}
      <div className="relative h-72 w-full rounded-br-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Hero / Heading Section */}
      <section className="my-8 max-w-3xl ">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </section>

      {/* Top Experiences */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {loading ? "Loading..." : `${results} Experiences Found`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <p>Loading experiences...</p>
          ) : (
            listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                imageSrc={listing.imageSrc}
                altText={listing.title}
                title={listing.title}
                location={listing.location}
                duration={listing.duration}
                price={listing.price}
                isFavorite={false}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};
