import Image from "next/image";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

/**
 * Renders the forgot-password page with the site logo and the forgot-password form.
 *
 * @returns A JSX element containing a centered container with the logo link and the ForgotPasswordForm component.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <Image
            src="/logo/logo-long.png"
            alt="GoOut Logo"
            width={100}
            height={50}
          />
        </a>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}