import { ShoppingBag } from "lucide-react";

export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading cart...</h1>
        <p className="text-gray-600">
          Please wait while we load your cart items.
        </p>
      </div>
    </div>
  );
}
