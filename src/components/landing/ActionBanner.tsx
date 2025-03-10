import React from "react";
import { Button } from "../ui/button";

const ActionBanner = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-12 px-6 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Ready to Explore?</h2>
        <p className="text-xl mb-8">
          Join us on an unforgettable journey through Sri Lanka&apos;s diverse
          landscapes and rich culture.
        </p>
        <Button
          variant="outline"
          className="bg-white text-black hover:bg-gray-200"
        >
          Explore Now
        </Button>
      </div>
    </section>
  );
};

export default ActionBanner;
