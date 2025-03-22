"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Gift,
  Star,
  User,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Listing } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExperienceDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [experience, setExperience] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching experience with ID:", id);
        const response = await fetch("/data/data.json");
        const data = await response.json();

        if (!id) {
          console.error("No ID provided");
          setLoading(false);
          return;
        }

        const foundExperience = data.listings.find(
          (item: Listing) => item.id === id
        );

        if (foundExperience) {
          console.log("Found experience:", foundExperience);
          setExperience(foundExperience);
        } else {
          console.error("Experience not found for ID:", id);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching experience:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
        <p className="text-xl">Experience not found for ID: {id}</p>
      </div>
    );
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Carousel */}
        <div className="relative rounded-lg overflow-hidden h-[400px] md:h-[500px]">
          <Image
            src={images[currentImageIndex] || experience.imageSrc}
            alt={experience.title}
            fill
            className="object-cover"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={handlePrevImage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={handleNextImage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  idx === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>
        </div>

        {/* Form Section */}
        <Card className="p-6 shadow-lg rounded-lg sticky top-24">
          <CardContent className="p-0 space-y-4">
            <div className="text-2xl font-bold">{experience.price}</div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Quantity
                </label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-16 mx-2 text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Available Date
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-03-21">March 21, 2025</SelectItem>
                    <SelectItem value="2025-03-22">March 22, 2025</SelectItem>
                    <SelectItem value="2025-03-23">March 23, 2025</SelectItem>
                    <SelectItem value="2025-03-24">March 24, 2025</SelectItem>
                    <SelectItem value="2025-03-25">March 25, 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3">
                Book this experience
              </Button>

              <Button
                variant="outline"
                className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 py-3"
              >
                <Gift className="mr-2 h-4 w-4" />
                Buy this as a gift
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Title and Location */}
      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-2">{experience.title}</h1>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-red-500" />
          <span>{experience.location}</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 text-red-500" />
          <span>{experience.duration}</span>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="important">Important Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-700">
              Experience the authentic culture and beauty of this unique
              adventure. Join us for an unforgettable journey that will create
              memories to last a lifetime.
            </p>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Highlights</h3>
              <ul className="list-disc pl-5 space-y-2">
                {highlights.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">What&apos;s Included</h3>
              <ul className="list-disc pl-5 space-y-2">
                {included.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Session Length</h3>
              <p className="text-gray-700">{experience.duration}</p>
            </div>
          </div>
        </TabsContent>

        {/* Important Information Tab */}
        <TabsContent value="important" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Important Information
            </h2>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Exclusions</h3>
              <ul className="list-disc pl-5 space-y-2">
                {exclusions.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">
                Additional Information
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {additionalInfo.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-gray-700">
                  123 Adventure St, Cityville, Country
                </span>
              </div>
              <Button variant="outline" size="sm">
                Get Directions
              </Button>
            </div>

            {/* Google Maps Placeholder */}
            <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                Google Maps integration would go here
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>

            {/* Review Stats Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-orange-400">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Overall Rating */}
                <div className="flex flex-col items-center justify-center border-r-2 border-orange-400">
                  <div className="text-5xl font-bold mb-2">
                    {reviewStats.average}
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(reviewStats.average)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {reviewStats.total} Reviews
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-4">
                  {reviewStats.distribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <span className="text-sm w-fit">{item.stars} Stars</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                      <span className="text-sm w-8 text-right">
                        {item.percent}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pros and Cons */}
                <div className="space-y-4 flex flex-col md:flex-row gap-4 justify-evenly items-start border-l-2 border-orange-400">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Pros</h3>
                    <ul className="space-y-1 text-sm">
                      {reviewStats.pros.map((pro, idx) => (
                        <li key={idx} className="text-gray-600">
                          - {pro.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Cons</h3>
                    <ul className="space-y-1 text-sm">
                      {reviewStats.cons.map((con, idx) => (
                        <li key={idx} className="text-gray-600">
                          - {con.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Customer Reviews</h3>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by: Most Helpful" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="most-helpful">Most Helpful</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="highest">Highest Rating</SelectItem>
                    <SelectItem value="lowest">Lowest Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews
                  .slice(0, showAllReviews ? reviews.length : 5)
                  .map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-6"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold">
                          {review.title || `Review by ${review.author}`}
                        </h4>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <User className="h-4 w-4 mr-1" />
                        <span>{review.author}</span>
                        <span className="mx-2">•</span>
                        <span>{review.date}</span>
                        {review.isVerified && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="text-green-600">
                              Verified purchaser
                            </span>
                          </>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4">{review.content}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Helpful ({review.helpful})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          Not Helpful ({review.unhelpful})
                        </Button>
                        <Button variant="ghost" size="sm">
                          Report
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Load More Button */}
              {!showAllReviews && reviews.length > 5 && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllReviews(true)}
                    className="flex items-center gap-1"
                  >
                    Load more reviews
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Write a Review Button */}
              <div className="flex justify-center mt-8">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Write a Review
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
