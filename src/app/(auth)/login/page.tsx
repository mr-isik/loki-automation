"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  AuthLayout,
  handleSocialLogin,
  LoginForm,
  type LoginFormData,
  setAuthTokens,
} from "@/features/auth";
import { AuthAPI } from "@/features/auth/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (_data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error, success } = await AuthAPI.login(_data);

      if (success && data) {
        setAuthTokens(data.access_token, data.refresh_token);

        const callbackUrl = searchParams.get("callbackUrl") || "/app";

        router.push(callbackUrl);
      } else if (error) {
        setError(error.message);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      footerLink={{
        text: "Create an account",
        href: "/signup",
      }}
      footerText="Don't have an account?"
      subtitle="Welcome back! Please enter your details."
      title="Log in to your account"
    >
      <LoginForm
        error={error || undefined}
        isLoading={isLoading}
        onSocialLogin={handleSocialLogin}
        onSubmit={handleLogin}
      />
    </AuthLayout>
  );
}
