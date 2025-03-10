"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";

interface Listing {
  id: string;
  imageSrc: string;
  title: string;
  location: string;
  duration: string;
  price: string;
}

const mockListings: Listing[] = [
  {
    id: "1",
    imageSrc: "/images/sydney-cruise.jpg",
    title: "Sunset & Sparkle Sydney Boat Cruise",
    location: "Sydney, Australia",
    duration: "1 hour",
    price: "LKR 11,183.69",
  },
  {
    id: "2",
    imageSrc: "/images/hotel.jpg",
    title: "Lakeside Motel Waterfront",
    location: "Melbourne, Australia",
    duration: "2 days",
    price: "LKR 25,000.00",
  },
  {
    id: "3",
    imageSrc: "/images/romantic-dinners.jpg",
    title: "Luxury Dinner in Paris",
    location: "Paris, France",
    duration: "3 hours",
    price: "LKR 50,000.00",
  },
  {
    id: "4",
    imageSrc: "/images/dinner-dates.jpg",
    title: "Dinner Date in Sri Lanka",
    location: "Colombo, Sri Lanka",
    duration: "3 hours",
    price: "LKR 50,000.00",
  },
];

const AllExperiences = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call delay
    setTimeout(() => {
      setListings(mockListings);
      setLoading(false);
    }, 1000); // Simulated 1-second delay
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search Bar */}
      <div className="w-full mb-8">
        <SearchBar />
      </div>

      {/* Listings Section */}
      {loading ? (
        <p className="text-center text-gray-500">Loading experiences...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              imageSrc={listing.imageSrc}
              altText={listing.title}
              title={listing.title}
              location={listing.location}
              duration={listing.duration}
              price={listing.price}
              isFavorite={false} // Default false
              onGiftClick={() => alert(`Booked: ${listing.title}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllExperiences;
