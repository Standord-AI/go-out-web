export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-pulse">
        {/* Hero Image */}
        <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
        
        {/* Title and Basic Info */}
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded mb-4 max-w-2xl"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 max-w-md"></div>
          <div className="h-6 bg-gray-200 rounded mb-8 max-w-lg"></div>
          
          {/* Price and Rating */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-8 mb-8">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded max-w-3xl"></div>
            <div className="h-4 bg-gray-200 rounded max-w-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 