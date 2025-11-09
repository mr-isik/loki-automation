/**
 * Main Navigation Component
 * Following Single Responsibility Principle - orchestrates navigation structure
 */

"use client";

import { useNavigation } from "../../hooks/useNavigation";
import { NavGroup } from "./NavGroup";

export const Navigation = () => {
  const { navigationGroups } = useNavigation();

  return (
    <>
      {navigationGroups.map((group) => (
        <NavGroup key={group.id} group={group} />
      ))}
    </>
  );
};
