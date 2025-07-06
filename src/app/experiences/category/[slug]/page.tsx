import React from 'react';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/categories/CategoryPage';
import { CategoryExperiencesResponse, ApiExperience } from '@/types';
import { Listing } from '@/types';
import { SETTINGS } from '@/core/config/common.settings';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPageWrapper({ params }: PageProps) {
  const { slug } = await params;

  try {
    // Pre-fetch the category data on the server side
    const response = await fetch(`${SETTINGS.CMS_API}/categories/${slug}/experiences`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      notFound();
    }

    const data: CategoryExperiencesResponse = await response.json();

    // Transform API experiences to Listing format for CategoryPage component
    const transformExperiencesToListings = (experiences: ApiExperience[]): Listing[] => {
      return experiences.map((exp) => ({
        id: exp._id,
        slug: exp.slug,
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
  } catch (error) {
    console.error('Error pre-fetching category data:', error);
    notFound();
  }
}