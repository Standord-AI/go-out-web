"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Checkout Error
        </h1>
        <p className="text-gray-600 mb-6">
          We encountered an error during checkout. Please try again or return to
          your cart. {error.message}
        </p>
        <div className="space-x-4">
          <Button onClick={reset} className="bg-orange-500 hover:bg-orange-600">
            Try again
          </Button>
          <Link href="/cart">
            <Button variant="outline">Return to Cart</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
