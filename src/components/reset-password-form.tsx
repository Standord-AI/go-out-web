"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Invalid reset link. Please request a new password reset.");
      setIsError(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);
    setIsSuccess(false);

    try {
      if (!token) {
        throw new Error(
          "Invalid reset link. Please request a new password reset."
        );
      }

      if (!newPassword || !confirmPassword) {
        throw new Error("Please fill in all fields");
      }

      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: newPassword,
        }),
      });

      let data = null;
      const ct = response.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        data = await response.json().catch(() => null);
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setMessage("Password reset successfully! Redirecting to login...");
      setIsSuccess(true);
      setIsError(false);

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again."
      );
      setIsError(true);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Invalid Reset Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 items-center">
              <XCircle className="size-10 text-destructive" />
              <p className="text-muted-foreground font-medium text-sm">
                The password reset link is invalid or has expired.
              </p>
              {message && (
                <div className="flex items-center gap-2 p-3 rounded-md text-xs border bg-red-100 text-destructive border-destructive/10 mb-6 font-medium">
                  <AlertCircle size={16} />
                  {message}
                </div>
              )}
              <Button
                onClick={() => router.push("/auth/forgot-password")}
                className="w-full"
              >
                Request New Reset Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {message && (
                <div
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-md text-xs border font-medium",
                    isError
                      ? "bg-red-100 text-destructive border-destructive/10"
                      : isSuccess
                      ? "bg-emerald-100 text-emerald-700 border-emerald-900/10"
                      : "bg-blue-100 text-blue-900 border-blue-900/10"
                  )}
                >
                  {isError ? (
                    <AlertCircle className="size-4 text-destructive" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="size-4 text-emerald-700" />
                  ) : (
                    <Mail className="size-4 text-blue-900" />
                  )}
                  {message}
                </div>
              )}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
            <div className="text-center text-sm mt-1">
              Remember your password?{" "}
              <a href="/auth/login" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our{" "}
        <a href="/terms-of-service">Terms of Service</a> and{" "}
        <a href="/privacy-policy">Privacy Policy</a>.
      </div>
    </div>
  );
}
