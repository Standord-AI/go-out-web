import React from 'react';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/categories/CategoryPage';
import { ApiExperience, Category, Listing } from '@/types';
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
    let subcategoryImage = '/images/placeholder.jpg'; // Default fallback image

    try {
      // Try to get the subcategory by slug first
      const subcategoryRes = await fetch(`${SETTINGS.CMS_API}/${mainCategory}/get-all`);
      if (subcategoryRes.ok) {
        const subcategories = await subcategoryRes.json();
        const subcategory = subcategories.find((cat: Category) => cat.slug === subCategorySlug);
        if (subcategory) {
          subcategoryId = subcategory._id;
          subcategoryName = subcategory.name;
          subcategoryDescription = subcategory.description;
          // Use the actual subcategory image if available
          subcategoryImage = subcategory.image || '/images/placeholder.jpg';
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
          image={subcategoryImage}
          results={0}
          listings={[]}
          loading={false}
        />
      );
    }

    // Transform API experiences to Listing format for CategoryPage component
    const transformExperiencesToListings = (experiences: Partial<ApiExperience>[]): Listing[] => {
      return experiences.map((exp) => ({
        id: exp._id as string,
        slug: exp.slug as string,
        imageSrc: exp.images?.[0] || '/images/placeholder.jpg',
        title: exp.title as string,
        location: exp.location ? `${exp.location.city}, ${exp.location.state}` : 'Location not specified',
        duration: exp.rates ? `${Math.min(...exp.rates.map(rate => rate.duration))} minutes` : 'Duration not specified',
        price: exp.rates ? `${Math.min(...exp.rates.map(rate => rate.price.amount))} ${exp.rates.find(rate=>rate.price.amount===Math.min(...exp.rates!.map(rate => rate.price.amount)))?.price.currency}` : 'Price not specified',
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
        image={subcategoryImage}
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
