import { ReportHeader } from "./ui/ReportHeader";

export default function ReportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ReportHeader />
      <main className="">{children}</main>
    </>
  );
}
