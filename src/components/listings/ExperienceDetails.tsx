"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageCarousel } from "./ImageCarousel";
import { BookingForm } from "./BookingForm";
import { HeaderInfo } from "./HeaderInfo";
import { OverviewTab } from "./tabs/OverviewTab";
import { ImportantInfoTab } from "./tabs/ImportantInfoTab";
import { LocationTab } from "./tabs/LocationTab";
import { ReviewsTab } from "./tabs/ReviewsTab";
import { ApiExperience, ApiTime, Review, ReviewStat } from "@/types";

const REVIEWS_PER_PAGE = 5;

interface ExperienceDetailsProps {
  experienceId: string;
  initialData?: ApiExperience;
}

export default function ExperienceDetails({
  experienceId,
  initialData,
}: ExperienceDetailsProps) {
  const [experience, setExperience] = useState<ApiExperience | null>(
    initialData || null
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStat>({
    averageRating: 0,
    totalReviews: 0,
    distribution: [],
  });
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [sortOption, setSortOption] = useState("newest");
  const [activeBookingTab, setActiveBookingTab] = useState("booking");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(!initialData);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<ApiTime[]>([]);
  const [isDateFullyBooked, setIsDateFullyBooked] = useState(false);

  const fetchReviews = useCallback(
    async (pageNum: number, shouldAppend = false) => {
      try {
        if (shouldAppend) {
          setLoadingMore(true);
        } else {
          setReviewsLoading(true);
        }

        const reviewsResponse = await fetch(
          `/api/reviews/experiences/${experienceId}?sortBy=${sortOption}&page=${pageNum}&limit=${REVIEWS_PER_PAGE}`
        );
        if (!reviewsResponse.ok) {
          throw new Error(`HTTP error! status: ${reviewsResponse.status}`);
        }
        const reviewsData: { reviews: Review[]; stats: ReviewStat } =
          await reviewsResponse.json();

        setReviews((prev) =>
          shouldAppend ? [...prev, ...reviewsData.reviews] : reviewsData.reviews
        );
        setStats(reviewsData.stats);
        setHasNextPage(reviewsData.reviews.length === REVIEWS_PER_PAGE);
        setPage(pageNum);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
        setLoadingMore(false);
      }
    },
    [experienceId, sortOption]
  );

  const fetchData = useCallback(async () => {
    if (initialData) {
      setExperience(initialData);
      setAvailableTimes(initialData.availableTimes?.times ?? []);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`/experiences/${experienceId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiExperience = await response.json();
      setExperience(data);
      setAvailableTimes(data.availableTimes?.times ?? []); // Initially set all times
    } catch (error) {
      console.error("Error fetching experience:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch experience"
      );
    } finally {
      setLoading(false);
    }
  }, [experienceId, initialData]);

  useEffect(() => {
    if (experienceId) {
      setPage(1); // Reset to first page
      setReviews([]); // Clear existing reviews
      fetchData();
    }
  }, [experienceId, fetchData]);

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  const fetchAvailabilityForDate = async (date: Date) => {
    if (!experience) return;
    try {
      const dateString = date.toISOString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/bookings/availability/${experience._id}?date=${dateString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            cache: "no-store",
          },
        }
      );
      const data = (await response.json().catch(() => null)) as
        | { availableTimes?: ApiTime[]; fullyBooked?: boolean }
        | null;

      setAvailableTimes(
        data?.availableTimes ?? experience.availableTimes?.times ?? []
      );
      setIsDateFullyBooked(Boolean(data?.fullyBooked));
    } catch (error: unknown) {
      console.error("Error fetching availability:", error);
      // Fallback to all times if availability check fails
      setAvailableTimes(experience.availableTimes?.times ?? []);
      setIsDateFullyBooked(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchReviews(nextPage, true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
        <p className="text-xl">Experience not found for ID: {experienceId}</p>
      </div>
    );
  }

  // Handlers for review interactions
  const handleAddReview = async (reviewData: {
    rating: number;
    title?: string;
    description: string;
  }) => {
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reviewData,
          experienceId: experienceId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      await fetchReviews(1);
    } catch (error: unknown) {
      console.error("Error adding review:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("Failed to mark review as helpful");
      }
      const updatedReview = (await response.json()) as Review;
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? updatedReview : review
        )
      );
    } catch (error: unknown) {
      console.error("Error marking review as helpful:", error);
    }
  };

  const handleUnhelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/unhelpful`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("Failed to mark review as unhelpful");
      }
      const updatedReview = (await response.json()) as Review;
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? updatedReview : review
        )
      );
    } catch (error: unknown) {
      console.error("Error marking review as unhelpful:", error);
    }
  };

  // Transform duration from minutes to readable format
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes === 60) {
      return "1 hour";
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} hours`;
      } else {
        return `${hours} hours ${remainingMinutes} minutes`;
      }
    }
  };

  // Format location
  const formatLocation = (location: ApiExperience["location"]) => {
    return `${location.city}, ${location.state}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Carousel Component */}
        <ImageCarousel images={experience.images} altText={experience.title} />

        <Tabs value={activeBookingTab} onValueChange={setActiveBookingTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="booking">Book Now</TabsTrigger>
            <TabsTrigger value="gift">Book as a Gift</TabsTrigger>
          </TabsList>
          <TabsContent value="booking">
            <BookingForm
              experienceId={experience._id}
              title={experience.title}
              image={experience.images[0]}
              location={{
                city: experience.location.city,
                country: experience.location.country,
              }}
              maxParticipants={experience.maxParticipants}
              showTimeSelector={true}
              rates={experience.rates}
              availableDates={experience.availableDates.dates}
              availableTimes={availableTimes} // Pass dynamic available times
              onDateChange={fetchAvailabilityForDate} // Pass handler to fetch availability
              isDateFullyBooked={isDateFullyBooked}
            />
          </TabsContent>
          <TabsContent value="gift">
            <BookingForm
              experienceId={experience._id}
              title={experience.title}
              image={experience.images[0]}
              location={{
                city: experience.location.city,
                country: experience.location.country,
              }}
              maxParticipants={experience.maxParticipants}
              showTimeSelector={true}
              rates={experience.rates}
              availableDates={experience.availableDates.dates}
              availableTimes={availableTimes}
              onDateChange={fetchAvailabilityForDate}
              isDateFullyBooked={isDateFullyBooked}
              isGiftForm={true}
            />
          </TabsContent>
        </Tabs>
      </div>

      <HeaderInfo
        title={experience.title}
        location={formatLocation(experience.location)}
        duration={formatDuration(
          Math.min(...experience.rates.map((rate) => rate.duration))
        )}
      />

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="important">Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            description={experience.description}
            highlights={experience.highlights}
            included={experience.inclusions}
            sessionLength={formatDuration(
              Math.min(...experience.rates.map((rate) => rate.duration))
            )}
          />
        </TabsContent>

        <TabsContent value="important">
          <ImportantInfoTab
            exclusions={experience.exclusions}
            additionalInfo={experience.additionalInfo}
          />
        </TabsContent>

        <TabsContent value="location">
          <LocationTab
            address={experience.location.address}
            lat={experience.location.coordinates?.latitude}
            lng={experience.location.coordinates?.longitude}
            googleMapsUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              experience.location.address
            )}`}
          />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsTab
            reviews={reviews}
            stats={stats}
            onAddReview={handleAddReview}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onHelpful={handleHelpful}
            onUnhelpful={handleUnhelpful}
            onLoadMore={handleLoadMore}
            hasNextPage={hasNextPage}
            isLoadingMore={loadingMore}
            reviewsLoading={reviewsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
