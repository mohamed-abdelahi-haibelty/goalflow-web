"use client";

import { Folder, MoreHorizontal, Plus, Sparkles } from "lucide-react";
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Project } from "@/generated/prisma/client";
import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import CreateProjectModal from "@/app/[locale]/(features)/project/ui/CreateProjectModal";
import { useTranslations } from "next-intl";
import { UpgradeModal } from "@/app/[locale]/(features)/billing/ui/UpgradeModal";

export function NavProjects({
  projects,
  isPro,
  userId,
  userEmail,
}: {
  projects: Project[];
  isPro: boolean;
  userId: string;
  userEmail: string;
}) {
  const t = useTranslations("nav.projects");
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Local state to manage the visual order of projects
  const [sortedProjects, setSortedProjects] = useState(projects);

  // Track the last promoted project ID
  const promotedIdRef = useRef<string | null>(null);

  // Extract current Project ID from URL
  const match = pathname.match(/\/project\/([^\/]+)/);
  const activeId = match ? match[1] : null;

  // FIXED: Sync with server data while preserving promoted order
  useEffect(() => {
    setSortedProjects((prev) => {
      // If we have a promoted project, preserve its position
      if (promotedIdRef.current && activeId === promotedIdRef.current) {
        // Find the promoted project in the new server data
        const promotedProject = projects.find(
          (p) => p.id === promotedIdRef.current
        );

        if (promotedProject) {
          // Keep it at the top, update the rest
          const otherProjects = projects.filter(
            (p) => p.id !== promotedIdRef.current
          );
          return [promotedProject, ...otherProjects];
        }
      }

      // Otherwise, just update with server data
      return projects;
    });
  }, [projects, activeId]);

  // SMART LIST LOGIC:
  // Whenever the activeId changes (user clicks a project), check if it needs promotion.
  useEffect(() => {
    if (!activeId) return;

    setSortedProjects((prev) => {
      const index = prev.findIndex((p) => p.id === activeId);

      // If project exists and is hidden (index >= 3), move it to the top
      if (index >= 3) {
        const projectToPromote = prev[index];
        promotedIdRef.current = activeId; // Track this promotion
        const newOrder = [
          projectToPromote,
          ...prev.filter((p) => p.id !== activeId),
        ];
        return newOrder;
      }

      // If it's already visible (index 0, 1, or 2), keep order as is
      return prev;
    });
  }, [activeId]);

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
        currentProjectCount={projects.length}
        isPro={isPro}
        userId={userId}
        userEmail={userEmail}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        userId={userId}
        userEmail={userEmail}
      />
    </>
  );
}
