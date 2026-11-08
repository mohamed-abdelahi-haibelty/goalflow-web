"use client";

import { Folder, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Project } from "@/generated/prisma/client";
import { Link, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import CreateProjectModal from "@/features/project/components/CreateProjectModal";
import { useTranslations } from "next-intl";

export function NavProjects({ projects }: { projects: Project[] }) {
  const t = useTranslations("nav.projects");
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const activeId = pathname.match(/\/project\/([^/]+)/)?.[1] ?? null;
  const activeIndex = projects.findIndex((project) => project.id === activeId);
  const sortedProjects =
    activeIndex >= 3
      ? [
          projects[activeIndex],
          ...projects.filter((project) => project.id !== activeId),
        ]
      : projects;

  // Split: Visible (Top 3) vs Hidden (Rest)
  const visibleProjects = sortedProjects.slice(0, 3);
  const hiddenProjects = sortedProjects.slice(3);

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>{t("label")}</SidebarGroupLabel>
        <SidebarMenu>
          {/* 1. Create Project Button */}
          <SidebarMenuItem className="mb-2">
            <SidebarMenuButton
              onClick={() => setIsCreateOpen(true)}
              className="text-sidebar-primary hover:text-sidebar-primary hover:bg-sidebar-accent/30   dark:text-primary dark:hover:text-primary dark:hover:bg-primary/10 dark:border-primary/30  border border-dashed justify-center"
            >
              <Plus className="size-4" />
              <span>{t("create")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* 2. Visible Projects (Top 3) */}
          {visibleProjects.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                isActive={item.id === activeId} // Visual Indicator
              >
                <Link href={`/project/${item.id}`}>
                  <Folder />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* 3. "More" Dropdown (Rest of projects) */}
          {hiddenProjects.length > 0 && (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="text-sidebar-foreground/70">
                    <MoreHorizontal className="text-sidebar-foreground/70" />
                    <span>{t("more")}</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg max-h-60 overflow-y-auto"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  {hiddenProjects.map((item) => (
                    <DropdownMenuItem key={item.id} asChild>
                      <Link
                        href={`/project/${item.id}`}
                        className="cursor-pointer w-full flex items-center"
                      >
                        {/* We don't apply active style inside dropdown because clicking it 
                             will move it out of the dropdown anyway */}
                        <Folder className="text-muted-foreground mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("create")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
}
