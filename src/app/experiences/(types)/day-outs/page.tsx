"use client";

import ListingCard from "@/components/ListingCard";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex mt-5">
        <ListingCard
          imageSrc="/images/hotel.jpg"
          altText="Sunset & Sparkle Sydney Boat Cruise"
          title="Sunset & Sparkle Sydney Boat Cruise"
          location="Sydney"
          duration="1 hour"
          price="LKR 11,300.00"
          isFavorite={true}
          onGiftClick={() => alert("Gift button clicked!")}
        />
      </div>
    </div>
  );
};

export default page;
