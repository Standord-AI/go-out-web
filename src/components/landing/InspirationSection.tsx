import React from "react";
import Image from "next/image";
import SectionHeader from "../SectionHeader";

const inspirations = [
  {
    title: "Top 10 Romantic Dinner Spots in Sri Lanka",
    description:
      "Discover breathtaking locations perfect for a special night with your loved one.",
    image: "/images/romantic-dinners.jpg",
  },
  {
    title: "Adventure Day-Outs for Friends and Family",
    description:
      "Explore thrilling activities and day-out packages that create unforgettable memories.",
    image: "/images/adventure-getaway.jpg",
  },
  {
    title: "Best High Tea Spots in Sri Lanka",
    description: "Savor the finest tea-time experiences in iconic locations.",
    image: "/images/high-teas.jpg",
  },
];

const InspirationsSection = () => {
  return (
    <section className="container mx-auto px-6 py-12">
      {/* Section Title */}
      <SectionHeader
        title="Get Inspired for Your Next Experience"
        subtitle="Here are some Articles that might help you find the perfect experience for you."
      />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {inspirations.map((item, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden shadow-lg min-h-[300px] group"
          >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 transform transition-transform duration-500 ease-in-out group-hover:scale-110">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 text-white flex flex-col justify-end h-full">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-300">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InspirationsSection;
