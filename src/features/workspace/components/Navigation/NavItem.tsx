/**
 * Navigation Item Component
 * Following Single Responsibility Principle - renders a single navigation item
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { NavigationItem } from "../../types/navigation.types";

interface NavItemProps {
  item: NavigationItem;
}

export const NavItem = ({ item }: NavItemProps) => {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.label}>
        <Link href={item.href} className="flex items-center gap-3">
          <Icon className="h-4 w-4" />
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <Badge
              variant="secondary"
              className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
