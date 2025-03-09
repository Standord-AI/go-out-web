import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <HeroSection
        searchBar={
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-lg flex">
              <Input
                type="text"
                placeholder="Search for experiences..."
                className="rounded-r-none text-lg placeholder:text-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-white"
              />
              <Button className="rounded-l-none bg-white text-black">
                Search
              </Button>
            </div>
          </div>
        }
      />
      <CategoriesSection />
    </div>
  );
}
