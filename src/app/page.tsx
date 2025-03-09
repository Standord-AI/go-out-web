import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Gift Memories, Not Stuff
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          GoOut is a platform that helps you find the perfect gift for your
          friends and family.
        </p>

        {/* Search Bar using ShadCN Components */}
        <div className="mt-10 flex items-center justify-center">
          <div className="relative w-full max-w-lg flex">
            <Input
              type="text"
              placeholder="Search for experiences..."
              className="rounded-r-none text-lg"
            />
            <Button className="rounded-l-none">
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
