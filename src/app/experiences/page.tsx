"use client";

import { useEffect, useState, useCallback } from "react";
import { SearchBar } from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import { ApiExperience } from "@/types";

interface PagedExperiencesResponse {
  metadata: Array<{ total: number; page: number }>;
  data: ApiExperience[];
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<ApiExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 12,
    total: 0,
  });

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const requestBody = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sortField: "createdAt",
        sortOrder: -1,
        filters: {
          searchText: searchQuery || "",
          archived: false,
          status: true,
          activities: selectedFilters.activities || [],
          recipients: selectedFilters.recipients || [],
          occassions: selectedFilters.occassions || [],
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/experiences/get-paged`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PagedExperiencesResponse[] = await response.json();
      const data = result[0]; // The API returns an array with one object containing metadata and data

      if (data && data.data) {
        setExperiences(data.data);
        setPagination((prev) => ({
          ...prev,
          total: data.metadata[0]?.total || 0,
        }));
      } else {
        setExperiences([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
      setExperiences([]);
      setPagination((prev) => ({ ...prev, total: 0 }));
      setError("Failed to fetch experiences. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, selectedFilters]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences, selectedFilters]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, pageIndex: 1 })); // Reset to first page on search
  }, []);

  const handleFilterChange = (filter: string, selectedOptions: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: selectedOptions,
    }));
    setPagination((prev) => ({ ...prev, pageIndex: 1 })); // Reset to first page on filter change
  };

  // Transform API experiences to Listing format for ListingCard component
  const transformExperiencesToListings = (experiences: ApiExperience[]) => {
    return experiences.map((exp) => ({
      id: exp._id,
      slug: exp.slug,
      imageSrc: exp.images?.[0] || "/images/placeholder.jpg",
      title: exp.title,
      location: exp.location ? `${exp.location.city}, ${exp.location.state}` : 'Location not specified',
      duration: exp.rates ? `${Math.min(...exp.rates.map(rate => rate.duration))} minutes` : 'Duration not specified',
      price: exp.rates ? `${Math.min(...exp.rates.map(rate => rate.price.amount))} ${exp.rates.find(rate=>rate.price.amount===Math.min(...exp.rates!.map(rate => rate.price.amount)))?.price.currency}` : 'Price not specified',
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
            return selectedOptions.some(
              (option) =>
                experience.location.city
                  .toLowerCase()
                  .includes(option.toLowerCase()) ||
                experience.location.state
                  .toLowerCase()
                  .includes(option.toLowerCase())
            );
          case "Price":
            if (!experience.rates) return false;
            const priceValue = Math.min(...experience.rates.map(rate => rate.price.amount));
            return selectedOptions.some((option) => {
              const [min, max] = option
                .split(" - ")
                .map((v) => parseInt(v.replace(/[^0-9]/g, "")));
              return max
                ? priceValue >= min && priceValue <= max
                : priceValue >= min;
            });
          case "activities":
            if (!experience.activities || experience.activities.length === 0)
              return false;
            return selectedOptions.some((option) =>
              experience.activities.includes(option)
            );
          case "recipients":
            if (!experience.recipients || experience.recipients.length === 0)
              return false;
            return selectedOptions.some((option) =>
              experience.recipients.includes(option)
            );
          case "occassions":
            if (!experience.occassions || experience.occassions.length === 0)
              return false;
            return selectedOptions.some((option) =>
              experience.occassions.includes(option)
            );
          default:
            return true;
        }
      }
    );

    return matchesFilters;
  });

  const listings = transformExperiencesToListings(filteredExperiences);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="w-full mb-8">
          <SearchBar
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="text-center py-8">
          <p className="text-gray-500">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="w-full mb-8">
          <SearchBar
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="text-center py-8">
          <p className="text-red-600">
            Failed to load experiences. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {listings.map((listing) => {
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
}
