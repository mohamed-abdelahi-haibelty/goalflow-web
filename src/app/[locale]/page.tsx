//root page
import { getUserSession } from "@/actions/auth/getUserSession";

import { getProjects } from "./(features)/project/action/getProjects";
import { createProject } from "./(features)/project/action/createProject";
import { redirect } from "@/i18n/navigation";

async function Home() {
  const session = await getUserSession();
  if (!session) redirect({ href: "/auth", locale: "en" });

  const { data: projects } = await getProjects();

  // If projects exist, go to the first one (most recently created usually, or check sort order)
  if (projects?.length) {
    return redirect({ href: `/project/${projects[0].id}`, locale: "en" });
  }

  // If NO projects exist (First time user), create one
  const newProject = await createProject({ name: "General" }, false); // No flag needed

  if (newProject.success && newProject.data) {
    redirect({ href: `/project/${newProject.data.id}`, locale: "en" });
  }

  console.error("Failed to create project:", newProject);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Unable to create project</h1>
        <p className="text-muted-foreground mb-4">{newProject.message}</p>
      </div>
    </div>
  );
}

export default Home;
