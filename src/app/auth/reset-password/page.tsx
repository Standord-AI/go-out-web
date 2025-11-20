import { ResetPasswordForm } from "@/components/reset-password-form";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image
            src="/logo/logo-long.png"
            alt="GoOut Logo"
            width={100}
            height={50}
          />
        </Link>
        <Suspense
          fallback={
            <div className="flex h-[500px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
