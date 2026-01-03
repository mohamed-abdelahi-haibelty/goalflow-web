import { BillingHeader } from "./ui/BillingHeader";

export default function ReportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BillingHeader />
      <main className="">{children}</main>
    </>
  );
}
