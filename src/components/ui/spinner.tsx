import * as React from "react";

import { cn } from "@/lib/utils";

import { cva } from "class-variance-authority";

import type { VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin rounded-full border-[1.5px] border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-6",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

export function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}
