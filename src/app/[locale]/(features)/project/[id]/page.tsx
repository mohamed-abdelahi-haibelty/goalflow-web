import { getUserSession } from "@/actions/auth/getUserSession";
import { notFound, redirect } from "next/navigation";
import { getProjectById } from "../action/getProjectById";
import ColumnContainer from "../../column/ui/ColumnContainer";
import { getColumns } from "../../column/action/getColumns";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

async function page({ params }: PageProps) {
  const session = await getUserSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth");
  }

  const project = await getProjectById(id);

  if (!project || project.code === 404) {
    return notFound();
  }

  const projectId = project?.data?.id;

  const columns = await getColumns(projectId!);

  return <ColumnContainer projectId={projectId!} data={columns.data ?? []} />;
}

export default page;
