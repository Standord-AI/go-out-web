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
import axios from "axios"; // Import axios

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
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<ApiTime[]>([]);
  const [isDateFullyBooked, setIsDateFullyBooked] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAvailableTimes(initialData.availableTimes.times);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/experiences/${experienceId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiExperience = await response.json();
        setExperience(data);
        setAvailableTimes(data.availableTimes.times); // Initially set all times
      } catch (error) {
        console.error("Error fetching experience:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch experience"
        );
      } finally {
        setLoading(false);
      }
    };

    if (experienceId) {
      fetchData();
    }
  }, [experienceId, initialData]);

  const fetchAvailabilityForDate = async (date: Date) => {
    if (!experience) return;
    try {
      const dateString = date.toISOString();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/bookings/availability/${experience._id}?date=${dateString}`
      );
      setAvailableTimes(response.data.availableTimes);
      setIsDateFullyBooked(response.data.fullyBooked);
    } catch (error) {
      console.error("Error fetching availability:", error);
      // Fallback to all times if availability check fails
      setAvailableTimes(experience.availableTimes.times);
      setIsDateFullyBooked(false);
    }
  };

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
  };

  const handleHelpful = (reviewId: string) => {
    console.log("Marked as helpful:", reviewId);
  };

  const handleUnhelpful = (reviewId: string) => {
    console.log("Marked as unhelpful:", reviewId);
  };

  const handleReport = (reviewId: string) => {
    console.log("Reported review:", reviewId);
  };

  // Handler for booking submissions
  const handleBooking = async (bookingData: BookingData) => {
    console.log("Booking submitted:", bookingData);
    try {
      // This is where you would collect user details (name, email, etc.)
      // For now, I'll use placeholder data.
      const bookingPayload = {
        ...bookingData,
        experienceId: experience._id,
        selectedDate: bookingData.date,
        selectedTime: bookingData.time,
        name: "Test User", // Placeholder
        email: "test@example.com", // Placeholder
        phoneNumber: "1234567890", // Placeholder
      };

      // Use the correct backend URL
      const response = await axios.post(
        "http://localhost:8080/api/bookings",
        bookingPayload
      );

      if (response.status === 201) {
        alert(`Booking successful! Your booking ID is ${response.data._id}`);
        // Re-fetch availability for the date to update the UI
        if (bookingData.date) {
          fetchAvailabilityForDate(bookingData.date);
        }
      }
    } catch (error: any) {
      console.error("Booking failed:", error);
      alert(
        `Booking failed: ${error.response?.data?.message || error.message}`
      );
    }
  };

  // Transform duration from minutes to readable format
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes === 60) return "1 hour";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0
      ? `${hours} hours`
      : `${hours} hours ${remainingMinutes} minutes`;
  };

  // Format location
  const formatLocation = (location: any) => {
    return `${location.city}, ${location.state}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageCarousel images={experience.images} altText={experience.title} />

        <BookingForm
          experienceId={experience._id}
          title={experience.title}
          image={experience.images[0]}
          location={{
            city: experience.location.city,
            country: experience.location.country,
          }}
          maxParticipants={experience.maxParticipants}
          onBooking={handleBooking} // Pass the real booking handler
          showTimeSelector={true}
          rates={experience.rates}
          availableDates={experience.availableDates.dates}
          availableTimes={availableTimes} // Pass dynamic available times
          onDateChange={fetchAvailabilityForDate} // Pass handler to fetch availability
          isDateFullyBooked={isDateFullyBooked}
        />
      </div>

      <HeaderInfo
        title={experience.title}
        location={formatLocation(experience.location)}
        duration={formatDuration(
          Math.min(...experience.rates.map((rate) => rate.duration))
        )}
      />

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="important">Important Info</TabsTrigger>
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
            reviews={experience.reviews}
            stats={{
              average: 0,
              total: 0,
              recommendations: 0,
              recommendPercent: 0,
              distribution: [],
              pros: [],
              cons: [],
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
