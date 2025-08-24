'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Subcategory page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          We encountered an error while loading the subcategory. Please try again.
        </p>
        <div className="space-x-4">
          <Button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = '/experiences'}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Go back to experiences
          </Button>
        </div>
      </div>
    </div>
  );
}
