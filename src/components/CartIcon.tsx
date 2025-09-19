"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { Button } from "./ui/button";

interface CartIconProps {
  className?: string;
  showCount?: boolean;
}

export function CartIcon({ className = "", showCount = true }: CartIconProps) {
  const { state } = useCart();

  return (
    <Link href="/cart">
      <Button variant="outline" size="sm" className={`relative ${className}`}>
        <ShoppingCart className="h-4 w-4" />
        {showCount && state.totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {state.totalItems}
          </span>
        )}
      </Button>
    </Link>
  );
}
