"use client";

import { useParams } from "next/navigation";
import ExperienceDetails from "@/components/listings/ExperienceDetails";

export default function ExperienceDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  return <ExperienceDetails experienceId={id} />;
}
