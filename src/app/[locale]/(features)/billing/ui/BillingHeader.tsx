import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations } from "next-intl/server";
import { getUserSession } from "@/actions/auth/getUserSession";
import db from "@/lib/db";
import { canUpdateStreakToday, isStreakBroken } from "@/lib/streak";
import { StreakCounter } from "../../streak/ui/StreakCounter";

export async function BillingHeader() {
  // 1. Fetch Project & User Session in parallel
  const [session, t] = await Promise.all([
    getUserSession(),
    getTranslations("breadcrumb"),
  ]);

  // 2. Fetch User Streak Data
  let streakCount = 0;
  let isActiveToday = false;

  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { streakCount: true, lastStreakUpgradeDate: true },
    });

    if (user) {
      // Logic: If streak is broken (missed more than 1 day), display 0.
      // Otherwise, display the DB count.
      const broken = isStreakBroken({
        lastStreakDate: user.lastStreakUpgradeDate,
      });
      streakCount = broken ? 0 : user.streakCount;

      // Logic: If they CANNOT update streak today, it means they ALREADY did it.
      isActiveToday = !canUpdateStreakToday({
        lastStreakDate: user.lastStreakUpgradeDate,
      });
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink>Billing</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{"Manage subscription"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ms-auto px-4 flex items-center gap-3">
        {session && (
          <StreakCounter count={streakCount} isActiveToday={isActiveToday} />
        )}
        <div className="flex items-center gap-0.5">
          <LanguageSwitcher />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
