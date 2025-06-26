"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SectionHeader from "../SectionHeader";
import CategoryCard from "./ProductCard";
import { SETTINGS } from "@/core/config/common.settings";

interface Experience {
  _id: string;
  refNo: string;
  title: string;
  description: string;
  duration: number;
  price: {
    amount: number;
    currency: string;
  };
  images: string[];
  status: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  archived: boolean;
  experiences: Experience[];
  experienceCount: number;
}

interface ApiResponse {
  categories: Category[];
  totalCategories: number;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `${SETTINGS.CMS_API}/categories/with-experiences`
        );
        setCategories(response.data.categories);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-6 py-12">
        <SectionHeader
          title="Explore Unique Experiences in Sri Lanka"
          subtitle="Discover and gift unforgettable day-outs, eat-outs, and more crafted to make every moment special."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-lg h-64 animate-pulse"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-6 py-12">
        <SectionHeader
          title="Explore Unique Experiences in Sri Lanka"
          subtitle="Discover and gift unforgettable day-outs, eat-outs, and more crafted to make every moment special."
        />
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 py-12">
      {/* Title */}
      <SectionHeader
        title="Explore Unique Experiences in Sri Lanka"
        subtitle="Discover and gift unforgettable day-outs, eat-outs, and more crafted to make every moment special."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            title={category.name}
            experiences={`${category.experienceCount}+ experiences`}
            image={category.image}
            endpoint={category.slug}
          />
        ))}
      </div>
    </section>
  );
}
