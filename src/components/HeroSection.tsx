import { ReactNode } from "react";

interface HeroSectionProps {
  searchBar: ReactNode;
}

export default function HeroSection({ searchBar }: HeroSectionProps) {
  return (
    <section
      className="relative w-full py-24 px-6 flex items-center justify-center text-white text-center min-h-[500px] rounded-2xl overflow-hidden"
      style={{
        backgroundImage: "url(/images/hero-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Gift Stories, Not Stuff
        </h1>
        <p className="mt-4 text-lg text-gray-200">
          Plan and book your perfect trip with expert advice, travel tips,
          destination information, and inspiration from us.
        </p>
        <div className="mt-8">{searchBar}</div>
      </div>
    </section>
  );
}
