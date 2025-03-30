import Image from "next/image";
import { SignupForm } from "@/components/signup-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <Image src="/logo/logo-long.png" alt="GoOut Logo" width={100} height={100} />
        </a>
        <SignupForm />
      </div>
    </div>
  );
}
