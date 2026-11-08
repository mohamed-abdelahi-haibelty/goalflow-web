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
import { getProjectById } from "@/features/project/actions/getProjectById";
import { ProjectActionsMenu } from "@/features/project/components/ProjectActionsMenu";
import { ModeToggle } from "@/components/ModeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations } from "next-intl/server";
import { getUserSession } from "@/actions/auth/getUserSession";
import db from "@/lib/db";
import { canUpdateStreakToday, isStreakBroken } from "@/lib/streak";
import { StreakCounter } from "@/features/streak/components/StreakCounter";

export async function ProjectHeader({
  projectId,
  direction,
}: {
  projectId: string;
  direction: string;
}) {
  // 1. Fetch Project & User Session in parallel
  const [projectData, session, t] = await Promise.all([
    getProjectById(projectId),
    getUserSession(),
    getTranslations("breadcrumb"),
  ]);

  const project = projectData?.data;

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
              <BreadcrumbLink>{t("project")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator dir={direction} className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{project?.name}</BreadcrumbPage>
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
        {project && (
          <ProjectActionsMenu
            projectId={project.id}
            projectName={project.name}
          />
        )}
      </div>
    </header>
  );
}
