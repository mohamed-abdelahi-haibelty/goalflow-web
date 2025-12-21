import { getDirection } from "@/lib/utils";
import { ReportHeader } from "./ui/ReportHeader";

export default async function ReportLayout({
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
      <ReportHeader />
      <main className="">{children}</main>
    </>
  );
}
