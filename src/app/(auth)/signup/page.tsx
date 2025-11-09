"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AuthLayout,
  handleSocialLogin,
  setAuthTokens,
  SignupForm,
  type SignupFormData,
} from "@/features/auth";
import { AuthAPI } from "@/features/auth/api";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error, success } = await AuthAPI.signup(data);

      if (success) {
        const {
          error: loginError,
          success: loginSuccess,
          data: loginData,
        } = await AuthAPI.login({
          email: data.email,
          password: data.password,
        });

        if (loginError) {
          setError(loginError.message);

          return;
        }

        if (loginSuccess && loginData) {
          setAuthTokens(loginData.access_token, loginData.refresh_token);

          router.push("/app");
        }
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
        text: "Log in to your account",
        href: "/login",
      }}
      footerText="Already have an account?"
      subtitle="Join us and start your journey."
      title="Create an account"
    >
      <SignupForm
        error={error || undefined}
        isLoading={isLoading}
        onSocialLogin={handleSocialLogin}
        onSubmit={handleSignup}
      />
    </AuthLayout>
  );
}
