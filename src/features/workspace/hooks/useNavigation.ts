/**
 * Navigation hook
 * Following Single Responsibility Principle
 */

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { navigationGroups } from "../data/navigationItems";
import { NavigationGroup } from "../types/navigation.types";

export const useNavigation = () => {
  const pathname = usePathname();

  const activeNavigationGroups: NavigationGroup[] = useMemo(() => {
    return navigationGroups.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        isActive: pathname === item.href,
      })),
    }));
  }, [pathname]);

  const activeItem = useMemo(() => {
    for (const group of activeNavigationGroups) {
      const found = group.items.find((item) => item.isActive);
      if (found) return found;
    }
    return null;
  }, [activeNavigationGroups]);

  return {
    navigationGroups: activeNavigationGroups,
    activeItem,
  };
};
