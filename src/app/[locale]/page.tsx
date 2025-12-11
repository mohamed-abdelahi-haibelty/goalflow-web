//root page
import { getUserSession } from "@/actions/auth/getUserSession";

import { redirect } from "next/navigation";
import { getProjects } from "./(features)/project/action/getProjects";

async function Home() {
  const session = await getUserSession();

  if (!session) {
    redirect("/auth");
  }

  const { data } = await getProjects();

  if (data?.length) {
    const project = data[0];
    redirect(`/project/${project.id}`);
    return;
  }

  return <div className="">NO Projects</div>;
}

export default Home;
