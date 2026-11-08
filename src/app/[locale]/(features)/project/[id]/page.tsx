import { getUserSession } from "@/actions/auth/getUserSession";
import { notFound, redirect } from "next/navigation";
import { getProjectById } from "@/features/project/actions/getProjectById";
import ColumnContainer from "@/features/column/components/ColumnContainer";
import { getColumns } from "@/features/column/actions/getColumns";
import { setRequestLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  return {
    title: project?.data?.name ? `GoalFlow | ${project.data.name}` : "GoalFlow",
  };
}

async function page({ params }: PageProps) {
  const session = await getUserSession();
  const { id, locale } = await params;

  if (!session) {
    redirect("/auth");
  }

  setRequestLocale(locale);

  const project = await getProjectById(id);

  if (!project || project.code === 404) {
    return notFound();
  }

  const projectId = project?.data?.id;

  const columns = await getColumns(projectId!);

  return <ColumnContainer projectId={projectId!} data={columns.data ?? []} />;
}

export default page;
