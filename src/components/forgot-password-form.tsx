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
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);
    setIsSuccess(false);

    try {
      if (!email) {
        throw new Error("Please enter your email address");
      }

      const response = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setMessage(
        "If an account with that email exists, a password reset link has been sent"
      );
      setIsSuccess(true);
      setIsError(false);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to process request. Please try again."
      );
      setIsError(true);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password
          </CardDescription>
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <a
                  href="/auth/login"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Remember your password?
                </a>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
            <div className="text-center text-sm mt-1">
              Don&apos;t have an account?{" "}
              <a href="/auth/signup" className="underline underline-offset-4">
                Sign up
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
