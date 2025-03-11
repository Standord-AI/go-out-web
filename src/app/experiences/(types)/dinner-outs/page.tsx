"use client";

import { CategoryPage } from "@/components/categories/CategoryPage";
import React, { useEffect, useState } from "react";
import { Listing } from "@/types";

export default function TwentyFirstBirthdayPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data/data.json");
      const data = await response.json();
      setListings(data.listings);
      setLoading(false);
    };

    setTimeout(() => {
      fetchData();
    }, 1000); // Simulated 1-second delay
  }, []);

  return (
    <CategoryPage
      title="Dinner Outs"
      description="Dinner outs can be a great way to celebrate a special occasion. Whether it's a birthday, 
        anniversary, or just a night out with friends, 
        we've got you covered with a wide range of unforgettable experiences in over 100 countries. 
        Browse the range and choose an experience gift that'll create memories to last a lifetime!"
      image="/images/dinner-dates.jpg"
      results={listings.length}
      listings={listings}
      loading={loading}
    />
  );
}
