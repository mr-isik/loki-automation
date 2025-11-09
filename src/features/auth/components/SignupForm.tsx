"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ChevronLeft, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { DynamicFormField } from "@/components/shared/DynamicFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";

import { signupSchema, type SignupFormData } from "../utils/validation";

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  onSocialLogin: (provider: "google" | "facebook") => void;
  isLoading?: boolean;
  error?: string;
}

export function SignupForm({
  onSubmit,
  isLoading = false,
  error,
}: SignupFormProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const handleSubmit = async (data: SignupFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {!showEmailForm ? (
        // Initial View - Social Login + Email Button
        <div className="space-y-4">
          {/* Email Continue Button */}
          <Button
            className="w-full"
            type="button"
            onClick={() => setShowEmailForm(true)}
          >
            <UserPlus />
            Continue with Email
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      ) : (
        // Email Form View
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          {/* Back Button */}
          <Button
            size={"sm"}
            type="button"
            variant="outline"
            onClick={() => setShowEmailForm(false)}
          >
            <ChevronLeft />
            Go Back
          </Button>

          {/* Signup Form */}
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <DynamicFormField
                control={form.control}
                disabled={isLoading}
                label="Username"
                name="username"
                placeholder="Your username"
                type="text"
              />

              <DynamicFormField
                control={form.control}
                disabled={isLoading}
                label="Email Address"
                name="email"
                placeholder="example@email.com"
                type="email"
              />

              <DynamicFormField
                control={form.control}
                disabled={isLoading}
                label="Password"
                name="password"
                placeholder="Your password"
                type="password"
              />

              <DynamicFormField
                control={form.control}
                disabled={isLoading}
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Your password"
                type="password"
              />

              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? <Spinner /> : "Create Account"}
                {!isLoading && <ArrowRight />}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
