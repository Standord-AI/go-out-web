import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Clock } from "lucide-react";
import Image from "next/image";

interface ListingCardProps {
  image: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  description: string;
  initialPrice?: string;
  newPrice: string;
  discount?: string;
  duration?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
  image,
  title,
  location,
  rating,
  reviews,
  description,
  initialPrice,
  newPrice,
  discount,
  duration,
}) => {
  return (
    <Card className="flex my-auto flex-row justify-center items-center w-full max-w-3xl overflow-hidden border border-gray-200 shadow-sm p-0 hover:shadow-md transition duration-300">
      {/* Left: Image */}
      <div className="relative w-1/3 h-40 ml-4">
        <Image src={image} alt={title} fill className="object-cover rounded-lg" />
      </div>

      {/* Right: Details */}
      <CardContent className="py-4 px-0 flex-1">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold hover:cursor-pointer">{title}</h3>
          {/* Favorite Button */}
          <Button variant="ghost" size="icon" className="group hover:cursor-pointer">
            <Heart className="w-6 h-6 text-gray-500 group-hover:text-red-500 transition duration-100" />
          </Button>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center text-sm text-gray-500">
          <span className="text-yellow-500">⭐</span>
          <span className="ml-1">{rating}</span>
          <span className="ml-2">({reviews} Reviews)</span>
        </div>

        {/* Location & Duration */}
        <div className="flex flex-col text-sm text-gray-500 mt-1">
          <div className="flex items-center">   
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
          {duration && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{duration}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
      </CardContent>

      {/* Footer: Pricing & CTA */}
      <CardFooter className="flex flex-col items-end space-y-2">
        {/* Discount Tag */}
        {discount && (
          <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {discount} off
          </span>
        )}

        {/* Price Section */}
        <div className="flex items-center space-x-2">
          {initialPrice && (
            <span className="text-gray-400 line-through text-sm">
              {initialPrice}
            </span>
          )}
          <span className="text-xl font-semibold text-gray-800">{newPrice}</span>
        </div>

        <span className="text-xs text-gray-500">Includes taxes and fees</span>

        {/* CTA Button */}
        <Button variant="default" size="lg" className="w-full hover:cursor-pointer">
          See Availability
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
