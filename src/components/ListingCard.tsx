"use client";

import React from "react";
import { Heart, MapPin, Clock, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ListingCardProps {
  id: string;
  imageSrc: string;
  altText: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  isFavorite?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  imageSrc,
  altText,
  title,
  location,
  duration,
  price,
  isFavorite,
}) => {
  const router = useRouter();

  // Ensure the ID is valid before navigation
  const navigateToDetails = () => {
    if (!id) {
      console.error("Cannot navigate: ID is undefined or empty");
      return;
    }
    
    console.log("Navigating to experience details with ID:", id);
    router.push(`/experiences/${id}`);
  };

  return (
    <div className="block no-underline">
      <Card className="min-w-80 bg-white rounded-2xl pt-0 hover:shadow-lg transition-all duration-300 mb-4 cursor-pointer" onClick={navigateToDetails}>
        <CardHeader className="relative p-0">
          <Image
            src={imageSrc}
            alt={altText}
            width={320}
            height={200}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <Button
            size={"icon"}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:bg-white z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle favorite action here
            }}
          >
            <Heart
              className={`w-6 h-6 text-gray-500 group-hover:text-red-500 transition ${
                isFavorite ? "text-red-500 fill-red-500" : ""
              }`}
            />
          </Button>
        </CardHeader>
        <CardContent className="py-0 h-24 overflow-hidden max-h-24">
          <CardTitle 
            className="text-lg mb-2 font-semibold text-gray-900 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigateToDetails();
            }}
          >
            {title}
          </CardTitle>
          <div className="flex flex-col gap-4 text-gray-600 text-sm mt-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-wrap">{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-red-500" />
              <span>{duration}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-3">
          <span className="text-gray-900 font-medium">{price}</span>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigateToDetails();
            }}
            className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-orange-600 transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5 text-white mr-1" />
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ListingCard;
