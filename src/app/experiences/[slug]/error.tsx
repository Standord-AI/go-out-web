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
    console.error('Experience details error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong!
        </h1>
        <p className="text-gray-600 mb-6">
          We couldn't load the experience details. Please try again.
        </p>
        <div className="space-x-4">
          <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700">
            Try again
          </Button>
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
} 