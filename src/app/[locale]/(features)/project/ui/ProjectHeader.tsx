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
import { getProjectById } from "../action/getProjectById";
import { ProjectActionsMenu } from "../ui/ProjectActionsMenu";
import { ModeToggle } from "@/components/ModeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations } from "next-intl/server";

export async function ProjectHeader({
  projectId,
  direction,
}: {
  projectId: string;
  direction: string;
}) {
  const { data: project } = await getProjectById(projectId);
  const t = await getTranslations("breadcrumb");

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

      <div className="ms-auto px-4 flex items-center gap-x-0.5">
        <LanguageSwitcher />
        <ModeToggle />
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
