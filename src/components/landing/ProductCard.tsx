import React from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card"; // Adjust path as needed

interface CategoryCardProps {
  title: string;
  experiences: string;
  image: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  experiences,
  image,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0 group">
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

      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{experiences}</p>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
