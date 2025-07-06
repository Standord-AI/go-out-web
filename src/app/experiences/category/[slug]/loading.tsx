export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="animate-pulse">
        {/* Image Banner */}
        <div className="h-72 bg-gray-200 rounded-br-full mb-8"></div>
        
        {/* Hero / Heading Section */}
        <section className="my-8 max-w-3xl">
          <div className="h-8 bg-gray-200 rounded mb-2 max-w-2xl"></div>
          <div className="h-4 bg-gray-200 rounded max-w-3xl"></div>
        </section>
        
        {/* Top Experiences */}
        <section>
          <div className="h-6 bg-gray-200 rounded mb-4 max-w-xs"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 