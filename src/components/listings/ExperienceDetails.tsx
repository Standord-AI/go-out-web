"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageCarousel } from "./ImageCarousel";
import { BookingForm, BookingData } from "./BookingForm";
import { HeaderInfo } from "./HeaderInfo";
import { OverviewTab } from "./tabs/OverviewTab";
import { ImportantInfoTab } from "./tabs/ImportantInfoTab";
import { LocationTab } from "./tabs/LocationTab";
import { ReviewsTab } from "./tabs/ReviewsTab";
import { ApiExperience, ApiTime } from "@/types";

interface ExperienceDetailsProps {
  experienceId: string;
  initialData?: ApiExperience;
}

export default function ExperienceDetails({
  experienceId,
  initialData,
}: ExperienceDetailsProps) {
  const [experience, setExperience] = useState<ApiExperience | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch data if we don't have initial data
    if (initialData) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching experience with ID:", experienceId);
        
        const response = await fetch(`/api/experiences/${experienceId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiExperience = await response.json();
        console.log("Fetched experience:", data);
        setExperience(data);
      } catch (error) {
        console.error("Error fetching experience:", error);
        setError(error instanceof Error ? error.message : 'Failed to fetch experience');
      } finally {
        setLoading(false);
      }
    };

    if (experienceId) {
      fetchData();
    }
  }, [experienceId, initialData]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
        <p className="text-xl">Loading experience details...</p>
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
  const handleAddReview = () => {
    console.log("Add review clicked");
    // Implement your add review functionality here
  };

  const handleHelpful = (reviewId: string) => {
    console.log("Marked as helpful:", reviewId);
    // Implement your helpful functionality here
  };

  const handleUnhelpful = (reviewId: string) => {
    console.log("Marked as unhelpful:", reviewId);
    // Implement your unhelpful functionality here
  };

  const handleReport = (reviewId: string) => {
    console.log("Reported review:", reviewId);
    // Implement your report functionality here
  };

  // Handler for booking submissions
  const handleBooking = (bookingData: BookingData) => {
    console.log("Booking submitted:", bookingData);
    // Implement your booking submission logic here
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

  // Format price
  const formatPrice = (price: { amount: number; currency: string }) => {
    return `${price.currency} ${price.amount}`;
  };

  // Format location
  const formatLocation = (location: any) => {
    return `${location.city}, ${location.state}`;
  };

  // Mock booked dates and times (you can integrate this with your booking API later)
  const bookedDates: Date[] = [];
  const bookedTimes: { date: Date; times: ApiTime[] }[] = [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Carousel Component */}
        <ImageCarousel 
          images={experience.images} 
          altText={experience.title} 
        />

        {/* Booking Form Component */}
        <BookingForm
          experienceId={experience._id}
          title={experience.title}
          image={experience.images[0]}
          location={{
            city: experience.location.city,
            country: experience.location.country
          }}
          maxParticipants={experience.maxParticipants}
          onBooking={handleBooking}
          showTimeSelector={true}
          rates={experience.rates}
          availableDates={experience.availableDates.dates}
          availableTimes={experience.availableTimes.times}
          bookedDates={bookedDates}
          bookedTimes={bookedTimes}
        />
      </div>

      {/* Header Info Component */}
      <HeaderInfo
        title={experience.title}
        location={formatLocation(experience.location)}
        duration={formatDuration(Math.min(...experience.rates.map((rate) => rate.duration)))}
      />

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="important">Important Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Overview Tab Component */}
        <TabsContent value="overview">
          <OverviewTab
            description={experience.description}
            highlights={experience.highlights}
            included={experience.inclusions}
            sessionLength={formatDuration(Math.min(...experience.rates.map((rate) => rate.duration)))}
          />
        </TabsContent>

        {/* Important Information Tab Component */}
        <TabsContent value="important">
          <ImportantInfoTab
            exclusions={experience.exclusions}
            additionalInfo={experience.additionalInfo}
          />
        </TabsContent>

        {/* Location Tab Component */}
        <TabsContent value="location">
          <LocationTab
            address={experience.location.address}
            lat={experience.location.coordinates.latitude}
            lng={experience.location.coordinates.longitude}
            googleMapsUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              experience.location.address
            )}`}
          />
        </TabsContent>

        {/* Reviews Tab Component */}
        <TabsContent value="reviews">
          <ReviewsTab
            reviews={experience.reviews}
            stats={{
              average: 0,
              total: 0,
              recommendations: 0,
              recommendPercent: 0,
              distribution: [],
              pros: [],
              cons: []
            }}
            onAddReview={handleAddReview}
            onHelpful={handleHelpful}
            onUnhelpful={handleUnhelpful}
            onReport={handleReport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
