import { ProjectHeader } from "../ui/ProjectHeader";

export default async function ProjectIdLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  return (
    <>
      <ProjectHeader projectId={id} />
      <main className="px-4">{children}</main>
    </>
  );
}
