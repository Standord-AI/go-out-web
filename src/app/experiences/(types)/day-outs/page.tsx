"use client";

import { CategoryPage } from "@/components/categories/CategoryPage";
import React from "react";
import { Listing } from "@/types";

const listings: Listing[] = [
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

export default function TwentyFirstBirthdayPage() {
  return (
    <CategoryPage
      title="Day Outs"
      description="
        Day outs are a great way to get away from the daily routine and enjoy some time with your loved ones. 
        Whether you're looking for a romantic getaway, a family adventure, or a solo escape, 
        we've got you covered with a wide range of unforgettable experiences in over 100 countries. 
        Browse the range and choose an experience gift that'll create memories to last a lifetime!"
      listings={listings}
    />
  );
}
