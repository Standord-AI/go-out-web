"use client";

import { useParams } from "next/navigation";
import ExperienceDetails from "@/components/listings/ExperienceDetails";

export default function ExperienceDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  return <ExperienceDetails experienceId={slug} />;
}
