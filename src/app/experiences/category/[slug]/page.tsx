import { notFound } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import CategoryCard from "@/components/landing/ProductCard";
import { SETTINGS } from "@/core/config/common.settings";

type CategoryType = "activities" | "occasions" | "recipients";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface CategoryEntity {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  experienceCount: number;
}

const fallbackSubcategories: Record<CategoryType, SubCategory[]> = {
  activities: [
    {
      _id: "adventure",
      name: "Adventure",
      slug: "adventure",
      description: "Thrilling outdoor activities",
      image: "/images/adventure-getaway.jpg",
      experienceCount: 8,
    },
    {
      _id: "cultural",
      name: "Cultural",
      slug: "cultural",
      description: "Traditional and cultural experiences",
      image: "/images/temple-of-tooth.jpg",
      experienceCount: 6,
    },
    {
      _id: "nature",
      name: "Nature",
      slug: "nature",
      description: "Natural and wildlife experiences",
      image: "/images/safari.jpg",
      experienceCount: 7,
    },
    {
      _id: "water-sports",
      name: "Water Sports",
      slug: "water-sports",
      description: "Aquatic adventures",
      image: "/images/beach-dinner.jpg",
      experienceCount: 4,
    },
  ],
  occasions: [
    {
      _id: "birthday",
      name: "Birthday",
      slug: "birthday",
      description: "Special birthday celebrations",
      image: "/images/romantic-dinners.jpg",
      experienceCount: 5,
    },
    {
      _id: "anniversary",
      name: "Anniversary",
      slug: "anniversary",
      description: "Romantic anniversary experiences",
      image: "/images/romantic-dinners.jpg",
      experienceCount: 4,
    },
    {
      _id: "corporate",
      name: "Corporate",
      slug: "corporate",
      description: "Business and team building",
      image: "/images/day-out.jpg",
      experienceCount: 3,
    },
    {
      _id: "holiday",
      name: "Holiday",
      slug: "holiday",
      description: "Holiday and seasonal experiences",
      image: "/images/high-teas.jpg",
      experienceCount: 6,
    },
  ],
  recipients: [
    {
      _id: "couples",
      name: "Couples",
      slug: "couples",
      description: "Perfect for romantic getaways",
      image: "/images/romantic-dinners.jpg",
      experienceCount: 8,
    },
    {
      _id: "families",
      name: "Families",
      slug: "families",
      description: "Family-friendly experiences",
      image: "/images/day-out.jpg",
      experienceCount: 6,
    },
    {
      _id: "friends",
      name: "Friends",
      slug: "friends",
      description: "Group activities for friends",
      image: "/images/adventure-getaway.jpg",
      experienceCount: 5,
    },
    {
      _id: "solo",
      name: "Solo Travelers",
      slug: "solo",
      description: "Individual experiences",
      image: "/images/sigiriya.jpg",
      experienceCount: 4,
    },
  ],
};

const categoryMeta: Record<
  CategoryType,
  { title: string; description: string; fallbackImage: string }
> = {
  activities: {
    title: "Activities & Adventures",
    description:
      "Discover exciting activities and adventures for every thrill-seeker",
    fallbackImage: "/images/adventure-getaway.jpg",
  },
  occasions: {
    title: "Special Occasions",
    description:
      "Perfect experiences for birthdays, anniversaries, and special moments",
    fallbackImage: "/images/romantic-dinners.jpg",
  },
  recipients: {
    title: "For Everyone",
    description:
      "Tailored experiences for different people and preferences",
    fallbackImage: "/images/day-out.jpg",
  },
};

const getExperienceCount = async (
  categoryType: CategoryType,
  categoryId: string
): Promise<number> => {
  try {
    const response = await fetch(
      `${SETTINGS.CMS_API}/experiences/by-category/${categoryType}/${categoryId}`
    );

    if (!response.ok) {
      return 0;
    }

    const experiences = await response.json();
    return Array.isArray(experiences) ? experiences.length : 0;
  } catch (error) {
    console.warn(`Failed to get count for ${categoryType} ${categoryId}:`, error);
    return 0;
  }
};

const fetchSubcategories = async (
  categoryType: CategoryType
): Promise<SubCategory[]> => {
  try {
    const response = await fetch(
      `${SETTINGS.CMS_API}/${categoryType}/get-all`
    );

    if (!response.ok) {
      return fallbackSubcategories[categoryType];
    }

    const entities = (await response.json()) as CategoryEntity[];
    const { fallbackImage } = categoryMeta[categoryType];

    const results = await Promise.all(
      entities.map(async (entity) => {
        const experienceCount = await getExperienceCount(
          categoryType,
          entity._id
        );

        return {
          _id: entity._id,
          name: entity.name,
          slug: entity.slug,
          description: entity.description ?? "",
          image: entity.image || fallbackImage,
          experienceCount,
        };
      })
    );

    return results;
  } catch (error) {
    console.warn("API not available, using fallback data:", error);
    return fallbackSubcategories[categoryType];
  }
};

export default async function CategoryPageWrapper({ params }: PageProps) {
  const isCategoryType = (value: string): value is CategoryType =>
    ["activities", "occasions", "recipients"].includes(value as CategoryType);

  const { slug } = await params;

  if (!isCategoryType(slug)) {
    notFound();
  }

  const categorySlug: CategoryType = slug;

  try {
    const subCategories = await fetchSubcategories(categorySlug);

    if (subCategories.length === 0) {
      notFound();
    }

    const { title, description } = categoryMeta[categorySlug];

    return (
      <div className="container mx-auto px-4 py-12">
        <SectionHeader title={title} subtitle={description} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subCategories.map((subCategory) => (
            <CategoryCard
              key={subCategory._id}
              title={subCategory.name}
              experiences={`${subCategory.experienceCount}+ experiences`}
              image={subCategory.image}
              endpoint={`/experiences/subcategory/${categorySlug}/${subCategory.slug}`}
            />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error pre-fetching category data:", error);
    notFound();
  }
}
