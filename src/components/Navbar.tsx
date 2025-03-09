import Link from "next/link";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Logo placeholder - replace with your actual logo */}
          <div className="relative h-8 w-8 bg-black rounded-full overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              L
            </div>
          </div>
          <span className="font-semibold text-xl">GoOut</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/experiences"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Experiences
          </Link>
          <Link
            href="/locations"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Locations
          </Link>
          <Link
            href="/locations"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Gift Ideas
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Log in
          </Button>
          <Button size="sm">Sign up</Button>
        </div>
      </div>
    </header>
  );
}
