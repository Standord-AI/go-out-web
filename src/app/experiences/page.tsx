"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import CategoryCard from "@/components/landing/ProductCard";

interface MainCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  experienceCount: number;
}

export default function ExperiencesPage() {
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        setLoading(true);
        
        // Define fallback categories in case API fails
        const fallbackCategories: MainCategory[] = [
          {
            _id: 'activities',
            name: 'Activities',
            slug: 'activities',
            description: 'Discover exciting activities and adventures',
            image: '/images/adventure-getaway.jpg',
            experienceCount: 25
          },
          {
            _id: 'occasions',
            name: 'Occasions',
            slug: 'occasions',
            description: 'Perfect experiences for special occasions',
            image: '/images/romantic-dinners.jpg',
            experienceCount: 18
          },
          {
            _id: 'recipients',
            name: 'Recipients',
            slug: 'recipients',
            description: 'Tailored experiences for different people',
            image: '/images/day-out.jpg',
            experienceCount: 32
          }
        ];

        try {
          // Try to fetch from API first
          const [activitiesRes, occasionsRes, recipientsRes] = await Promise.all([
            fetch('http://localhost:3000/activities/get-all'),
            fetch('http://localhost:3000/occasions/get-all'),
            fetch('http://localhost:3000/recipients/get-all')
          ]);

          if (activitiesRes.ok && occasionsRes.ok && recipientsRes.ok) {
            const [activities, occasions, recipients] = await Promise.all([
              activitiesRes.json(),
              occasionsRes.json(),
              recipientsRes.json()
            ]);

            // Transform to main categories format with real counts
            const categories: MainCategory[] = [
              {
                _id: 'activities',
                name: 'Activities',
                slug: 'activities',
                description: 'Discover exciting activities and adventures',
                image: '/images/adventure-getaway.jpg',
                experienceCount: activities.length || 0
              },
              {
                _id: 'occasions',
                name: 'Occasions',
                slug: 'occasions',
                description: 'Perfect experiences for special occasions',
                image: '/images/romantic-dinners.jpg',
                experienceCount: occasions.length || 0
              },
              {
                _id: 'recipients',
                name: 'Recipients',
                slug: 'recipients',
                description: 'Tailored experiences for different people',
                image: '/images/day-out.jpg',
                experienceCount: recipients.length || 0
              }
            ];

            setMainCategories(categories);
          } else {
            // If API fails, use fallback data
            setMainCategories(fallbackCategories);
          }
        } catch (apiError) {
          console.warn('API not available, using fallback data:', apiError);
          // Use fallback data if API is not available
          setMainCategories(fallbackCategories);
        }

        setError(null);
      } catch (err) {
        console.error("Error setting up categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMainCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SectionHeader
          title="Explore Unique Experiences in Sri Lanka"
          subtitle="Discover and gift unforgettable day-outs, eat-outs, and more crafted to make every moment special."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-lg h-80 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <SectionHeader
        title="Explore Unique Experiences in Sri Lanka"
        subtitle="Discover and gift unforgettable day-outs, eat-outs, and more crafted to make every moment special."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mainCategories.map((category) => (
          <CategoryCard
            key={category._id}
            title={category.name}
            experiences={`${category.experienceCount}+ experiences`}
            image={category.image}
            endpoint={`/experiences/category/${category.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
