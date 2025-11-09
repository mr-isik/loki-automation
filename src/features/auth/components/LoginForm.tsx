"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ChevronLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { DynamicFormField } from "@/components/shared/DynamicFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";

import { loginSchema, type LoginFormData } from "../utils/validation";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onSocialLogin: (provider: "google" | "facebook") => void;
  isLoading?: boolean;
  error?: string;
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  error,
}: LoginFormProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    event?.preventDefault();
    await onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {!showEmailForm ? (
        <div className="space-y-4">
          {/* Email Continue Button */}
          <Button
            className="w-full"
            type="button"
            onClick={() => setShowEmailForm(true)}
          >
            <Mail />
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

          {/* Login Form */}
          <Form {...form}>
            <form
              className="space-y-5"
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

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password
                </Link>
              </div>

              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? <Spinner /> : "Log In"}
                {!isLoading && <ArrowRight />}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
