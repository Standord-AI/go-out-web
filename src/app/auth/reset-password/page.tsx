import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-password-form";
import Link from "next/link";
import Image from "next/image";

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
        <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading reset form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
