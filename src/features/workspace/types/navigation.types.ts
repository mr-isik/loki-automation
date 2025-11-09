/**
 * Navigation type definitions
 * Following Interface Segregation Principle
 */

import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
  isActive?: boolean;
}

export interface NavigationGroup {
  id: string;
  label?: string;
  items: NavigationItem[];
}
