import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/categories/CategoryPage";
import { Listing } from "@/types";
import { SETTINGS } from "@/core/config/common.settings";

interface PageProps {
  params: Promise<{
    mainCategory: string;
    subCategorySlug: string;
  }>;
}

interface SubcategoryEntity {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface ApiExperienceSummary {
  _id: string;
  slug: string;
  images?: string[];
  title: string;
  location?: {
    city?: string;
    state?: string;
  };
  duration?: number;
  price?: {
    currency: string;
    amount: number;
  };
  category?: {
    name?: string;
  };
}

const mapExperiencesToListings = (
  experiences: ApiExperienceSummary[]
): Listing[] =>
  experiences.map((experience) => ({
    id: experience._id,
    slug: experience.slug,
    imageSrc: experience.images?.[0] || "/images/placeholder.jpg",
    title: experience.title,
    location:
      experience.location?.city && experience.location?.state
        ? `${experience.location.city}, ${experience.location.state}`
        : "Location not specified",
    duration: typeof experience.duration === "number"
      ? `${experience.duration} minutes`
      : "Duration not specified",
    price:
      experience.price?.currency && typeof experience.price.amount === "number"
        ? `${experience.price.currency} ${experience.price.amount}`
        : "Price not specified",
    activity: experience.category?.name || "Experience",
    recipient: "All ages",
    occasion: "Any occasion",
  }));

export default async function SubCategoryPageWrapper({
  params,
}: PageProps) {
  const { mainCategory, subCategorySlug } = await params;

  try {
    let subcategoryId = subCategorySlug;
    let subcategoryName = subCategorySlug;
    let subcategoryDescription = `Experiences in ${subCategorySlug}`;
    let subcategoryImage = "/images/placeholder.jpg";

    try {
      const subcategoryRes = await fetch(
        `${SETTINGS.CMS_API}/${mainCategory}/get-all`
      );

      if (subcategoryRes.ok) {
        const subcategories = (await subcategoryRes.json()) as SubcategoryEntity[];
        const subcategory = subcategories.find(
          (category) => category.slug === subCategorySlug
        );

        if (subcategory) {
          subcategoryId = subcategory._id;
          subcategoryName = subcategory.name;
          subcategoryDescription =
            subcategory.description ?? subcategoryDescription;
          subcategoryImage = subcategory.image || subcategoryImage;
        }
      }
    } catch (error) {
      console.error("Error fetching subcategory details:", error);
    }

    let experiences: ApiExperienceSummary[] = [];

    try {
      const response = await fetch(
        `${SETTINGS.CMS_API}/experiences/by-category/${mainCategory}/${subcategoryId}`
      );

      if (response.ok) {
        experiences = (await response.json()) as ApiExperienceSummary[];
      }
    } catch (error) {
      console.warn("API not available, using empty experiences list:", error);
    }

    if (experiences.length === 0) {
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

    const listings = mapExperiencesToListings(experiences);

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
    console.error("Error pre-fetching subcategory data:", error);
    notFound();
  }
}
