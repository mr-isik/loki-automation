/**
 * Navigation Group Component
 * Following Single Responsibility Principle - renders a group of navigation items
 */

"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { NavigationGroup } from "../../types/navigation.types";
import { NavItem } from "./NavItem";

interface NavGroupProps {
  group: NavigationGroup;
}

export const NavGroup = ({ group }: NavGroupProps) => {
  return (
    <SidebarGroup>
      {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
