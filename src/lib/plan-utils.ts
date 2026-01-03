import { Plan, User } from "@/generated/prisma/browser";

/**
 * Checks if a user should have access to "Pro" features.
 * Access is granted if they:
 * 1. Are an Admin
 * 2. Have a PRO plan (via subscription or manual set)
 * 3. Have a LIFETIME/Free Access plan
 */
export function hasProAccess(user: Partial<User> | null | undefined): boolean {
  if (!user) return false;

  const privilegedPlans: Plan[] = ["PRO", "LIFETIME"];

  return user.role === "ADMIN" || privilegedPlans.includes(user.plan ?? "FREE");
}
