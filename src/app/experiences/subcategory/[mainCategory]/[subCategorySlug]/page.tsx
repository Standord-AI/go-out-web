import React from 'react';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/categories/CategoryPage';
import { Listing } from '@/types';
import { SETTINGS } from '@/core/config/common.settings';

interface PageProps {
  params: Promise<{
    mainCategory: string;
    subCategorySlug: string;
  }>;
}

export default async function SubCategoryPageWrapper({ params }: PageProps) {
  const { mainCategory, subCategorySlug } = await params;

  try {
    // First, get the subcategory ID by slug
    let subcategoryId = subCategorySlug;
    let subcategoryName = subCategorySlug;
    let subcategoryDescription = `Experiences in ${subCategorySlug}`;

    try {
      // Try to get the subcategory by slug first
      const subcategoryRes = await fetch(`${SETTINGS.CMS_API}/${mainCategory}/get-all`);
      if (subcategoryRes.ok) {
        const subcategories = await subcategoryRes.json();
        const subcategory = subcategories.find((cat: any) => cat.slug === subCategorySlug);
        if (subcategory) {
          subcategoryId = subcategory._id;
          subcategoryName = subcategory.name;
          subcategoryDescription = subcategory.description;
        }
      }
    } catch (error) {
      console.error('Error fetching subcategory details:', error);
    }

    // Try to fetch experiences from the API
    let experiences = [];
    try {
      const response = await fetch(`${SETTINGS.CMS_API}/experiences/by-category/${mainCategory}/${subcategoryId}`);
      if (response.ok) {
        experiences = await response.json();
      }
    } catch (apiError) {
      console.warn('API not available, using empty experiences list:', apiError);
    }

    if (!experiences || experiences.length === 0) {
      // If no experiences found, return empty state
      return (
        <CategoryPage
          title={subcategoryName}
          description={subcategoryDescription}
          image="/images/placeholder.jpg"
          results={0}
          listings={[]}
          loading={false}
        />
      );
    }

    // Transform API experiences to Listing format for CategoryPage component
    const transformExperiencesToListings = (experiences: any[]): Listing[] => {
      return experiences.map((exp) => ({
        id: exp._id,
        slug: exp.slug,
        imageSrc: exp.images?.[0] || '/images/placeholder.jpg',
        title: exp.title,
        location: exp.location ? `${exp.location.city}, ${exp.location.state}` : 'Location not specified',
        duration: exp.duration ? `${exp.duration} minutes` : 'Duration not specified',
        price: exp.price ? `${exp.price.currency} ${exp.price.amount}` : 'Price not specified',
        activity: exp.category?.name || 'Experience',
        recipient: 'All ages',
        occasion: 'Any occasion',
      }));
    };

    const listings = transformExperiencesToListings(experiences);

    return (
      <CategoryPage
        title={subcategoryName}
        description={subcategoryDescription}
        image="/images/placeholder.jpg"
        results={listings.length}
        listings={listings}
        loading={false}
      />
    );
  } catch (error) {
    console.error('Error pre-fetching subcategory data:', error);
    notFound();
  }
}
