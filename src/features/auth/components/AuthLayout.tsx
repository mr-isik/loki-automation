"use client";

import { Brain, Sparkles, Star } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: {
    text: string;
    href: string;
  };
  className?: string;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  className,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Advanced Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-primary/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "1s" }}
        />

        {/* Floating Stars */}
        <div className="absolute top-32 right-1/4 text-muted-foreground/20 animate-pulse">
          <Star className="h-4 w-4" />
        </div>
        <div
          className="absolute bottom-32 left-1/3 text-muted-foreground/20 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        >
          <Sparkles className="h-5 w-5" />
        </div>
        <div
          className="absolute top-1/3 right-12 text-muted-foreground/20 animate-pulse"
          style={{ animationDelay: "3s" }}
        >
          <Star className="h-3 w-3" />
        </div>
      </div>

      <div className={cn("w-full max-w-lg mx-auto relative z-10", className)}>
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <Link className="inline-flex items-center space-x-3 group" href="/">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg group-hover:shadow-primary/25 group-hover:-translate-y-1 transition-all duration-300 border border-primary/20">
                <Brain className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <div className="text-start">
              <span className="text-4xl font-bold text-foreground block leading-none">
                Loki
              </span>
              <span className="text-muted-foreground text-xs font-medium tracking-wide">
                Automation for Developers
              </span>
            </div>
          </Link>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            Automate your workflows and boost productivity.
          </p>
        </div>

        {/* Auth Card with Glass Morphism */}
        <Card className="w-full flex-1">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

          <CardHeader className="relative space-y-3 text-center">
            <div className="mx-auto w-12 h-1 bg-primary rounded-full mb-4" />
            <CardTitle className="text-3xl font-bold">{title}</CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              {subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6 px-8">
            {children}
          </CardContent>

          {/* Footer */}
          <div className="relative px-8 pb-8">
            <div className="w-full h-px bg-border mb-6" />
            <p className="text-center text-sm text-muted-foreground">
              {footerText}{" "}
              <Link
                className="font-semibold text-primary hover:underline transition-colors duration-200"
                href={footerLink.href}
              >
                {footerLink.text}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
