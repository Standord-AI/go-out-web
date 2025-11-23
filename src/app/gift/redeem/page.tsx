"use client";

import { Suspense } from "react";
import { RedeemPage } from "./components/RedeemPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[500px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <RedeemPage />
    </Suspense>
  );
}
