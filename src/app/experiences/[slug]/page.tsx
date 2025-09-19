import React from 'react';
import { notFound } from 'next/navigation';
import { SETTINGS } from '@/core/config/common.settings';
import ExperienceDetails from '@/components/listings/ExperienceDetails';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ExperiencePage({ params }: PageProps) {
  const { slug } = await params;

  try {
    // Fetch the experience by slug
    const response = await fetch(`${SETTINGS.CMS_API}/experiences/${slug}`);
    
    if (!response.ok) {
      notFound();
    }

    const experience = await response.json();

    if (!experience) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <ExperienceDetails 
          experienceId={experience._id} 
          initialData={experience} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching experience:', error);
    notFound();
  }
}
