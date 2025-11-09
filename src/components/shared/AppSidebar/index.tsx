"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Navigation } from "@/features/workspace/components/Navigation";
import { WorkspaceSwitcher } from "@/features/workspace/components/WorkspaceSwitcher";

/**
 * AppSidebar Component
 * Single Responsibility: Main sidebar container for navigation
 * Open/Closed Principle: Open for extension through composition
 *
 * Features:
 * - Workspace switcher
 * - Navigation menu with page links
 * - Clean and minimal design
 */
export function AppSidebar() {
  return (
    <Sidebar className="border-r">
      {/* Workspace Switcher */}
      <SidebarHeader className="border-b px-4 py-4">
        <WorkspaceSwitcher />
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent className="px-2 py-4">
        <Navigation />
      </SidebarContent>
    </Sidebar>
  );
}
