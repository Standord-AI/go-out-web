"use client";

import { useEffect, useState, useCallback } from "react";
import { SearchBar } from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";

interface Listing {
  id: string;
  imageSrc: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  activity: string;
  recipient: string;
  occasion: string;
}

const mockListings: Listing[] = [
  {
    id: "1",
    imageSrc: "/images/sydney-cruise.jpg",
    title: "Sunset & Sparkle Sydney Boat Cruise",
    location: "Sydney, Australia",
    duration: "1 hour",
    price: "$50",
    activity: "Adventure",
    recipient: "For Couples",
    occasion: "Valentine's Day",
  },
  {
    id: "2",
    imageSrc: "/images/hotel.jpg",
    title: "Lakeside Motel Waterfront",
    location: "Melbourne, Australia",
    duration: "2 days",
    price: "$200",
    activity: "Travel",
    recipient: "For Families",
    occasion: "Family Vacation",
  },
  {
    id: "3",
    imageSrc: "/images/romantic-dinners.jpg",
    title: "Luxury Dinner in Paris",
    location: "Paris, France",
    duration: "3 hours",
    price: "$150",
    activity: "Food & Drink",
    recipient: "For Him",
    occasion: "Anniversary",
  },
  {
    id: "4",
    imageSrc: "/images/dinner-dates.jpg",
    title: "Dinner Date in Sri Lanka",
    location: "Colombo, Sri Lanka",
    duration: "3 hours",
    price: "$100",
    activity: "Food & Drink",
    recipient: "For Her",
    occasion: "Date Night",
  },
  {
    id: "5",
    imageSrc: "/images/dinner-dates.jpg",
    title: "Dinner Date in Sri Lanka",
    location: "Colombo, Sri Lanka",
    duration: "3 hours",
    price: "$100",
    activity: "Food & Drink",
    recipient: "For Her",
    occasion: "Date Night",
  },
];

const AllExperiences = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});

  useEffect(() => {
    // Simulating API call delay
    setTimeout(() => {
      setListings(mockListings);
      setLoading(false);
    }, 1000); // Simulated 1-second delay
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = (filter: string, selectedOptions: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: selectedOptions,
    }));
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilters = Object.entries(selectedFilters).every(
      ([filter, selectedOptions]) => {
        // Check based on the filter type
        if (filter === "Location") {
          return (
            selectedOptions.length === 0 ||
            selectedOptions.includes(listing.location)
          );
        } else if (filter === "Price") {
          // Assuming price is a string like "$50", we need to convert it to a number for comparison
          const priceValue = parseInt(listing.price.replace(/[^0-9]/g, "")); // Extract numeric value
          return (
            selectedOptions.length === 0 ||
            selectedOptions.some((option) => {
              const [min, max] = option
                .split(" - ")
                .map((v) => parseInt(v.replace(/[^0-9]/g, "")));
              return max
                ? priceValue >= min && priceValue <= max
                : priceValue >= min;
            })
          );
        } else if (filter === "Activity") {
          return (
            selectedOptions.length === 0 ||
            selectedOptions.includes(listing.activity)
          );
        } else if (filter === "Recipient") {
          return (
            selectedOptions.length === 0 ||
            selectedOptions.includes(listing.recipient)
          );
        } else if (filter === "Occasion") {
          return (
            selectedOptions.length === 0 ||
            selectedOptions.includes(listing.occasion)
          );
        }
        return true; // Default case
      }
    );

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search Bar */}
      <div className="w-full mb-8">
        <SearchBar
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Listings Section */}
      {loading ? (
        <p className="text-center text-gray-500">Loading experiences...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
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
      )}
    </div>
  );
};

export default AllExperiences;
