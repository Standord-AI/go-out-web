"use client";

import React from "react";
import { Heart, MapPin, Clock, ShoppingCart } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ListingCardProps {
  imageSrc: string;
  altText: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  isFavorite?: boolean;
  onGiftClick?: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({
  imageSrc,
  altText,
  title,
  location,
  duration,
  price,
  isFavorite,
  onGiftClick,
}) => {
  return (
    <Card className="w-80 bg-white rounded-2xl pt-0 hover:shadow-lg transition-all duration-300">
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
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:bg-white"
        >
          <Heart
            className={`w-6 h-6 text-gray-500 group-hover:text-red-500 transition ${
              isFavorite ? "text-red-500 fill-red-500" : ""
            }`}
          />
        </Button>
      </CardHeader>
      <CardContent className="py-0">
        <CardTitle className="text-lg mb-2 font-semibold text-gray-900">
          {title}
        </CardTitle>
        <div className="flex items-center gap-4 text-gray-600 text-sm mt-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>{location}</span>
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
          onClick={onGiftClick}
          className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-orange-600 transition-all duration-300"
        >
          <ShoppingCart className="w-5 h-5 text-white" />
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
