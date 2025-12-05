import { getUserSession } from "@/actions/auth/getUserSession";
import { getProjects } from "./project/action/getProjects";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getUserSession();

  if (!session) {
    redirect("/auth");
  }

  const { data } = await getProjects();

  if (data?.length) {
    const project = data[0];
    redirect(`/project/${project.id}`);
  }

  return <div className="">NO Projects</div>;
}
