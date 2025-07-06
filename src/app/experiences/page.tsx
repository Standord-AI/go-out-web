"use client";

import { useEffect, useState, useCallback } from "react";
import { SearchBar } from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import { ApiExperience } from "@/types";

interface PagedExperiencesResponse {
  metadata: Array<{ total: number; page: number }>;
  data: ApiExperience[];
}

const AllExperiences = () => {
  const [experiences, setExperiences] = useState<ApiExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 12,
    total: 0,
  });

  const fetchExperiences = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      console.log("Fetching experiences with filters:", filters);
      
      const requestBody = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sortField: "createdAt",
        sortOrder: -1,
        filters: {
          searchText: searchQuery || "",
          archived: false,
          status: true,
          ...filters,
        },
      };

      const response = await fetch(`/api/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PagedExperiencesResponse[] = await response.json();
      const data = result[0]; // The API returns an array with one object containing metadata and data
      
      console.log("Fetched experiences:", data);
      
      if (data && data.data) {
        setExperiences(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.metadata[0]?.total || 0,
        }));
      } else {
        setExperiences([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
      setExperiences([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, searchQuery]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, pageIndex: 1 })); // Reset to first page on search
  }, []);

  const handleFilterChange = (filter: string, selectedOptions: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: selectedOptions,
    }));
    setPagination(prev => ({ ...prev, pageIndex: 1 })); // Reset to first page on filter change
  };

  // Transform API experiences to Listing format for ListingCard component
  const transformExperiencesToListings = (experiences: ApiExperience[]) => {
    return experiences.map((exp) => ({
      id: exp._id,
      slug: exp.slug,
      imageSrc: exp.images?.[0] || '/images/placeholder.jpg',
      title: exp.title,
      location: exp.location ? `${exp.location.city}, ${exp.location.state}` : 'Location not specified',
      duration: exp.duration ? `${exp.duration} minutes` : 'Duration not specified',
      price: exp.price ? `${exp.price.currency} ${exp.price.amount}` : 'Price not specified',
      activity: exp.category?.name || 'Experience',
      recipient: 'All ages',
      occasion: 'Any occasion',
    }));
  };

  const filteredExperiences = experiences.filter((experience) => {
    const matchesFilters = Object.entries(selectedFilters).every(
      ([filter, selectedOptions]) => {
        if (selectedOptions.length === 0) return true;
        
        switch (filter) {
          case "Location":
            if (!experience.location) return false;
            return selectedOptions.some(option => 
              experience.location.city.toLowerCase().includes(option.toLowerCase()) ||
              experience.location.state.toLowerCase().includes(option.toLowerCase())
            );
          case "Price":
            if (!experience.price) return false;
            const priceValue = experience.price.amount;
            return selectedOptions.some((option) => {
              const [min, max] = option
                .split(" - ")
                .map((v) => parseInt(v.replace(/[^0-9]/g, "")));
              return max
                ? priceValue >= min && priceValue <= max
                : priceValue >= min;
            });
          case "Activity":
            return selectedOptions.includes(experience.category?.name || '');
          case "Recipient":
            return selectedOptions.includes('All ages'); // Default for now
          case "Occasion":
            return selectedOptions.includes('Any occasion'); // Default for now
          default:
            return true;
        }
      }
    );

    return matchesFilters;
  });

  const listings = transformExperiencesToListings(filteredExperiences);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => {
            console.log("Rendering listing card with ID:", listing.id);
            return (
              <ListingCard
                key={listing.id}
                slug={listing.slug}
                id={listing.id}
                imageSrc={listing.imageSrc}
                altText={listing.title}
                title={listing.title}
                location={listing.location}
                duration={listing.duration}
                price={listing.price}
                isFavorite={false}
              />
            );
          })}
        </div>
      )}

      {/* Pagination Info */}
      {!loading && (
        <div className="mt-8 text-center text-gray-600">
          Showing {listings.length} of {pagination.total} experiences
        </div>
      )}
    </div>
  );
};

export default AllExperiences;
