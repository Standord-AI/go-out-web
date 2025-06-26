"use client";

import React, { useEffect, useState, use } from 'react';
import { CategoryPage } from '@/components/categories/CategoryPage';
import { CategoryExperiencesResponse, ApiExperience } from '@/types';
import { Listing } from '@/types';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CategoryPageWrapper: React.FC<PageProps> = ({ params }) => {
  const { slug } = use(params);
  const [data, setData] = useState<CategoryExperiencesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/categories/${slug}/experiences`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: CategoryExperiencesResponse = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryData();
    }
  }, [slug]);

  // Transform API experiences to Listing format for CategoryPage component
  const transformExperiencesToListings = (experiences: ApiExperience[]): Listing[] => {
    return experiences.map((exp) => ({
      id: exp._id,
      imageSrc: exp.images[0] || '/images/placeholder.jpg',
      title: exp.title,
      location: `${exp.location.city}, ${exp.location.state}`,
      duration: `${exp.duration} minutes`,
      price: `${exp.price.currency} ${exp.price.amount}`,
      activity: exp.category.name,
      recipient: 'All ages',
      occasion: 'Any occasion',
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-72 bg-gray-200 rounded-br-full mb-8"></div>
          <div className="h-8 bg-gray-200 rounded mb-4 max-w-md"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 max-w-2xl"></div>
          <div className="h-6 bg-gray-200 rounded mb-4 max-w-xs"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Category</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">No Data Found</h1>
          <p className="text-gray-600">Unable to load category information.</p>
        </div>
      </div>
    );
  }

  const listings = transformExperiencesToListings(data.experiences);

  return (
    <CategoryPage
      title={data.category.name}
      description={data.category.description}
      image={data.category.image}
      results={data.pagination.totalExperiences}
      listings={listings}
      loading={false}
    />
  );
};

export default CategoryPageWrapper;