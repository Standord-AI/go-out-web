"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Listing } from "@/types";
import { ImageCarousel } from "./ImageCarousel";
import { BookingForm, BookingData } from "./BookingForm";
import { HeaderInfo } from "./HeaderInfo";
import { OverviewTab } from "./tabs/OverviewTab";
import { ImportantInfoTab } from "./tabs/ImportantInfoTab";
import { LocationTab } from "./tabs/LocationTab";
import { ReviewsTab } from "./tabs/ReviewsTab";

interface ExperienceDetailsProps {
  experienceId: string;
}

export default function ExperienceDetails({
  experienceId,
}: ExperienceDetailsProps) {
  const [experience, setExperience] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock images array - in a real app these would come from the API
  const images = [
    "/images/day-out.jpg",
    "/images/elephant.jpg",
    "/images/high-teas.jpg",
  ];

  // Mock reviews data
  const reviews = [
    {
      id: "1",
      author: "Crystal",
      date: "5 days ago",
      rating: 5,
      title: "Your lips, but better!",
      content:
        "Feels great on my lips, perfect amount of color. The shade Ecstatic is even better than Black Honey, the red base is better on me.",
      isVerified: true,
      helpful: 34,
      unhelpful: 1,
    },
    {
      id: "2",
      author: "Jenny",
      date: "10 days ago",
      rating: 2,
      title: "I had to apply more than I like",
      content:
        "For my desired look I needed to apply a lot of lipstick - it was not ideal.",
      isVerified: false,
      helpful: 34,
      unhelpful: 0,
    },
    {
      id: "3",
      author: "Michael",
      date: "15 days ago",
      rating: 4,
      content:
        "Great experience overall, would recommend to anyone looking for something unique.",
      isVerified: true,
      helpful: 20,
      unhelpful: 2,
    },
    {
      id: "4",
      author: "Sarah",
      date: "1 month ago",
      rating: 5,
      content: "Absolutely loved it! One of the best experiences I've had.",
      isVerified: true,
      helpful: 15,
      unhelpful: 0,
    },
    {
      id: "5",
      author: "David",
      date: "2 months ago",
      rating: 3,
      content:
        "It was good but not as amazing as I expected based on the description.",
      isVerified: true,
      helpful: 8,
      unhelpful: 1,
    },
  ];

  // Stats for reviews
  const reviewStats = {
    average: 4.3,
    total: 1345,
    recommendations: 121,
    recommendPercent: 89,
    distribution: [
      { stars: 5, percent: 73 },
      { stars: 4, percent: 18 },
      { stars: 3, percent: 5 },
      { stars: 2, percent: 3 },
      { stars: 1, percent: 1 },
    ],
    pros: [
      { name: "Quality", rating: 4.0 },
      { name: "Easy to remove", rating: 4.8 },
      { name: "Easy to apply", rating: 4.1 },
      { name: "Long lasting", rating: 4.7 },
      { name: "Value", rating: 4.7 },
    ],
    cons: [{ name: "Smaller size" }, { name: "A little thin" }],
  };

  // Mock highlights, what's included, and important information
  const highlights = [
    "Immersive cultural experience",
    "Expert local guide",
    "Small group size for personalized attention",
  ];

  const included = [
    "All equipment",
    "Snacks and refreshments",
    "Photos of your experience",
    "Transportation from meeting point",
  ];

  const exclusions = [
    "Gratuities",
    "Hotel pickup and drop-off",
    "Personal expenses",
  ];

  const additionalInfo = [
    "Minimum age: 12 years",
    "Not recommended for pregnant women",
    "Moderate physical fitness level required",
    "Not wheelchair accessible",
  ];

  // Mock booking data - in a real app this would be retrieved from your database
  const bookedDates = [new Date(2025, 2, 26), new Date(2025, 2, 27)]; // March 26 and 27, 2025
  const bookedTimes = [
    {
      date: new Date(2025, 2, 24), // March 24, 2025
      times: ["10:00 AM", "1:00 PM"],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching experience with ID:", experienceId);
        const response = await fetch("/data/data.json");
        const data = await response.json();

        if (!experienceId) {
          console.error("No ID provided");
          setLoading(false);
          return;
        }

        const foundExperience = data.listings.find(
          (item: Listing) => item.id === experienceId
        );

        if (foundExperience) {
          console.log("Found experience:", foundExperience);
          setExperience(foundExperience);
        } else {
          console.error("Experience not found for ID:", experienceId);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching experience:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [experienceId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
        <p className="text-xl">Loading experience details...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Carousel Component */}
        <ImageCarousel images={images} altText={experience.title} />

        {/* Booking Form Component */}
        <BookingForm
          price={experience.price}
          onBooking={handleBooking}
          showTimeSelector={true}
          timeIntervals={[30, 60, 120]} // 30 mins, 1 hour, 2 hours
          bookedDates={bookedDates}
          bookedTimes={bookedTimes}
        />
      </div>

      {/* Header Info Component */}
      <HeaderInfo
        title={experience.title}
        location={experience.location}
        duration={experience.duration}
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
            description="Experience the authentic culture and beauty of this unique adventure. Join us for an unforgettable journey that will create memories to last a lifetime."
            highlights={highlights}
            included={included}
            sessionLength={experience.duration}
          />
        </TabsContent>

        {/* Important Information Tab Component */}
        <TabsContent value="important">
          <ImportantInfoTab
            exclusions={exclusions}
            additionalInfo={additionalInfo}
          />
        </TabsContent>

        {/* Location Tab Component */}
        <TabsContent value="location">
          <LocationTab
            address="Eiffel Tower, Paris, France"
            lat={48.8584}
            lng={2.2945}
            googleMapsUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              "Eiffel Tower, Paris, France"
            )}`}
          />
        </TabsContent>

        {/* Reviews Tab Component */}
        <TabsContent value="reviews">
          <ReviewsTab
            reviews={reviews}
            stats={reviewStats}
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
