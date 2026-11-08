import { getProjects } from "@/features/project/actions/getProjects";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavReport } from "./ui/NavReport";

export async function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const projects = await getProjects();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavProjects projects={projects.data ?? []} />
        <NavReport />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
