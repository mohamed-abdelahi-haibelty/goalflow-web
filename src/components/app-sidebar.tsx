import { getProjects } from "@/app/[locale]/(features)/project/action/getProjects";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavReport } from "./ui/NavReport";
import { getUser } from "@/actions/auth/getUser";
import { NavUpgrade } from "./ui/navUpgrade";
import { hasProAccess } from "@/lib/plan-utils";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const projects = await getProjects();
  const { data } = await getUser();
  const isPro = hasProAccess(data);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavProjects
          projects={projects.data ?? []}
          userEmail={data?.email ?? ""}
          userId={data?.id ?? ""}
          isPro={isPro}
        />
        <NavReport />
      </SidebarContent>
      <SidebarFooter>
        <NavUpgrade
          user={{
            id: data?.id ?? "",
            email: data?.email ?? "",
            isPro: isPro,
          }}
        />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
