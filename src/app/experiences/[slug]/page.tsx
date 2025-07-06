import { notFound } from 'next/navigation';
import ExperienceDetails from "@/components/listings/ExperienceDetails";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ExperienceDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    // Pre-fetch the experience data on the server side
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/experiences/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      notFound();
    }

    const experience = await response.json();

    return <ExperienceDetails experienceId={slug} initialData={experience} />;
  } catch (error) {
    console.error('Error pre-fetching experience:', error);
    notFound();
  }
}
