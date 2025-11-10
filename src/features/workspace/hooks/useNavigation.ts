/**
 * Navigation hook
 * Following Single Responsibility Principle
 */

import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { getNavigationGroups } from "../data/navigationItems";
import { NavigationGroup } from "../types/navigation.types";

export const useNavigation = () => {
  const pathname = usePathname();
  const params = useParams();
  const workspaceId = params.workspaceId as string | undefined;

  const activeNavigationGroups: NavigationGroup[] = useMemo(() => {
    const groups = getNavigationGroups(workspaceId);
    return groups.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        isActive: pathname === item.href,
      })),
    }));
  }, [pathname, workspaceId]);

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
