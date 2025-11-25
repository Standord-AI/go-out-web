import React from 'react';
import { notFound } from 'next/navigation';
import SectionHeader from '@/components/SectionHeader';
import CategoryCard from '@/components/landing/ProductCard';
import { Category } from '@/types';
import { config } from '@/lib/config';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  experienceCount: number;
}

export default async function CategoryPageWrapper({ params }: PageProps) {
  const { slug } = await params;

  try {
    let subCategories: SubCategory[] = [];
    let categoryTitle = '';
    let categoryDescription = '';

    // Define fallback subcategories for each main category
    const fallbackSubcategories = {
      activities: [
        { _id: 'adventure', name: 'Adventure', slug: 'adventure', description: 'Thrilling outdoor activities', image: '/images/adventure-getaway.jpg', experienceCount: 8 },
        { _id: 'cultural', name: 'Cultural', slug: 'cultural', description: 'Traditional and cultural experiences', image: '/images/temple-of-tooth.jpg', experienceCount: 6 },
        { _id: 'nature', name: 'Nature', slug: 'nature', description: 'Natural and wildlife experiences', image: '/images/safari.jpg', experienceCount: 7 },
        { _id: 'water-sports', name: 'Water Sports', slug: 'water-sports', description: 'Aquatic adventures', image: '/images/beach-dinner.jpg', experienceCount: 4 }
      ],
      occasions: [
        { _id: 'birthday', name: 'Birthday', slug: 'birthday', description: 'Special birthday celebrations', image: '/images/romantic-dinners.jpg', experienceCount: 5 },
        { _id: 'anniversary', name: 'Anniversary', slug: 'anniversary', description: 'Romantic anniversary experiences', image: '/images/romantic-dinners.jpg', experienceCount: 4 },
        { _id: 'corporate', name: 'Corporate', slug: 'corporate', description: 'Business and team building', image: '/images/day-out.jpg', experienceCount: 3 },
        { _id: 'holiday', name: 'Holiday', slug: 'holiday', description: 'Holiday and seasonal experiences', image: '/images/high-teas.jpg', experienceCount: 6 }
      ],
      recipients: [
        { _id: 'couples', name: 'Couples', slug: 'couples', description: 'Perfect for romantic getaways', image: '/images/romantic-dinners.jpg', experienceCount: 8 },
        { _id: 'families', name: 'Families', slug: 'families', description: 'Family-friendly experiences', image: '/images/day-out.jpg', experienceCount: 6 },
        { _id: 'friends', name: 'Friends', slug: 'friends', description: 'Group activities for friends', image: '/images/adventure-getaway.jpg', experienceCount: 5 },
        { _id: 'solo', name: 'Solo Travelers', slug: 'solo', description: 'Individual experiences', image: '/images/sigiriya.jpg', experienceCount: 4 }
      ]
    };

    // Function to get experience count for a subcategory
    const getExperienceCount = async (categoryType: string, categoryId: string): Promise<number> => {
      try {
        const response = await fetch(`${config.backendApiUrl}/experiences/by-category/${categoryType}/${categoryId}`);
        
        if (response.ok) {
          const experiences = await response.json();
          // Return the actual length of experiences array
          return Array.isArray(experiences) ? experiences.length : 0;
        }
        return 0;
      } catch (error) {
        console.warn(`Failed to get count for ${categoryType} ${categoryId}:`, error);
        return 0;
      }
    };

    // Fetch subcategories based on the main category
    try {
      switch (slug) {
        case 'activities':
          const activitiesRes = await fetch(`${config.backendApiUrl}/activities/get-all`);
          if (activitiesRes.ok) {
            const activities = await activitiesRes.json();
            // Fetch real experience counts for each activity
            const activitiesWithCounts = await Promise.all(
              activities.map(async (activity: Category) => {
                const experienceCount = await getExperienceCount('activities', activity._id);
                return {
                  _id: activity._id,
                  name: activity.name,
                  slug: activity.slug,
                  description: activity.description,
                  image: activity.image || '/images/adventure-getaway.jpg',
                  experienceCount
                };
              })
            );
            subCategories = activitiesWithCounts;
          } else {
            subCategories = fallbackSubcategories.activities;
          }
          categoryTitle = 'Activities & Adventures';
          categoryDescription = 'Discover exciting activities and adventures for every thrill-seeker';
          break;

        case 'occasions':
          const occasionsRes = await fetch(`${config.backendApiUrl}/occasions/get-all`);
          if (occasionsRes.ok) {
            const occasions = await occasionsRes.json();
            // Fetch real experience counts for each occasion
            const occasionsWithCounts = await Promise.all(
              occasions.map(async (occasion: Category) => {
                const experienceCount = await getExperienceCount('occasions', occasion._id);
                return {
                  _id: occasion._id,
                  name: occasion.name,
                  slug: occasion.slug,
                  description: occasion.description,
                  image: occasion.image || '/images/romantic-dinners.jpg',
                  experienceCount
                };
              })
            );
            subCategories = occasionsWithCounts;
          } else {
            subCategories = fallbackSubcategories.occasions;
          }
          categoryTitle = 'Special Occasions';
          categoryDescription = 'Perfect experiences for birthdays, anniversaries, and special moments';
          break;

        case 'recipients':
          const recipientsRes = await fetch(`${config.backendApiUrl}/recipients/get-all`);
          if (recipientsRes.ok) {
            const recipients = await recipientsRes.json();
            // Fetch real experience counts for each recipient
            const recipientsWithCounts = await Promise.all(
              recipients.map(async (recipient: Category) => {
                const experienceCount = await getExperienceCount('recipients', recipient._id);
                return {
                  _id: recipient._id,
                  name: recipient.name,
                  slug: recipient.slug,
                  description: recipient.description,
                  image: recipient.image || '/images/day-out.jpg',
                  experienceCount
                };
              })
            );
            subCategories = recipientsWithCounts;
          } else {
            subCategories = fallbackSubcategories.recipients;
          }
          categoryTitle = 'For Everyone';
          categoryDescription = 'Tailored experiences for different people and preferences';
          break;

        default:
          notFound();
      }
    } catch (apiError) {
      console.warn('API not available, using fallback data:', apiError);
      // Use fallback data if API is not available
      switch (slug) {
        case 'activities':
          subCategories = fallbackSubcategories.activities;
          categoryTitle = 'Activities & Adventures';
          categoryDescription = 'Discover exciting activities and adventures for every thrill-seeker';
          break;
        case 'occasions':
          subCategories = fallbackSubcategories.occasions;
          categoryTitle = 'Special Occasions';
          categoryDescription = 'Perfect experiences for birthdays, anniversaries, and special moments';
          break;
        case 'recipients':
          subCategories = fallbackSubcategories.recipients;
          categoryTitle = 'For Everyone';
          categoryDescription = 'Tailored experiences for different people and preferences';
          break;
        default:
          notFound();
      }
    }

    if (subCategories.length === 0) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <SectionHeader
          title={categoryTitle}
          subtitle={categoryDescription}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subCategories.map((subCategory) => (
            <CategoryCard
              key={subCategory._id}
              title={subCategory.name}
              experiences={`${subCategory.experienceCount}+ experiences`}
              image={subCategory.image}
              endpoint={`/experiences/subcategory/${slug}/${subCategory.slug}`}
            />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error pre-fetching category data:', error);
    notFound();
  }
}