import { getDirection } from "@/lib/utils";
import { ProjectHeader } from "@/features/project/components/ProjectHeader";

export default async function ProjectIdLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string; locale: string }>;
}>) {
  const { id, locale } = await params;
  const direction = getDirection(locale);

  return (
    <>
      <ProjectHeader projectId={id} direction={direction} />
      <main className="px-4">{children}</main>
    </>
  );
}
