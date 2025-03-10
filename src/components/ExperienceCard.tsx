import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Heart, MapPin, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ExperienceCardProps {
  title: string;
  location: string;
  duration?: string;
  price: string;
  image: string;
  isFavorite?: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  location,
  duration,
  price,
  image,
  isFavorite = false,
}) => {
  return (
    <Card className="w-72 shrink-0 overflow-hidden relative p-0 flex flex-col mb-4 group">
      {/* Image */}
      <CardContent className="p-0">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            priority
          />
        </div>
      </CardContent>

      {/* Details */}
      <CardFooter className="flex flex-col items-start p-4 space-y-3 flex-grow">
        {/* Title - Ensures wrapping */}
        <h3 className="text-xl font-bold break-words whitespace-normal">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="mr-2 w-5 h-5" />
          <p>{location}</p>
        </div>

        {/* Duration */}
        {duration && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-2 w-5 h-5" />
            <p>{duration}</p>
          </div>
        )}

        {/* Push price & buttons to bottom for consistent alignment */}
        <div className="flex-grow"></div>

        {/* Divider for better separation */}
        <div className="w-full border-t border-gray-200 my-2"></div>

        {/* Price & Action Buttons */}
        <div className="flex items-center justify-between w-full">
          <span className="text-gray-700 font-medium text-lg">{price}</span>

          <div className="flex items-center space-x-2">
            {/* Add to Favorites Button */}
            <Button variant="outline" size="icon" className="group">
              <Heart
                className={`w-6 h-6 text-gray-500 group-hover:text-red-500 transition ${
                  isFavorite ? "text-red-500 fill-red-500" : ""
                }`}
              />
            </Button>

            {/* Book Now Button */}
            <Button variant="default" size="lg">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="ml-2">Book Now</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExperienceCard;
