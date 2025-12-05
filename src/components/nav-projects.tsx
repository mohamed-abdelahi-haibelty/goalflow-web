"use client";

import { Cog, FileChartColumn, LayoutDashboard } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { notFound } from "next/navigation";

export function NavProjects() {
  const pathname = usePathname();
  const id = pathname.split("/")[2]; // Assuming the ID is the second segment in the URL
  console.log("id", id);

  if (!id) {
    return notFound();
  }

  const items = [
    {
      name: "Project",
      url: `/project/${id}`,
      icon: LayoutDashboard,
    },
    {
      name: "Report",
      url: `/project/${id}/report`,
      icon: FileChartColumn,
    },
    {
      name: "Setting",
      url: `/project/${id}/setting`,
      icon: Cog,
    },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Goalflow</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname.startsWith(item.url);
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton isActive={isActive} asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
