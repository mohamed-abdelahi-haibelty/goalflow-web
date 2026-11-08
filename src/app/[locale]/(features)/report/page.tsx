import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportTable } from "@/features/report/components/ReportTable";
import { getTranslations } from "next-intl/server";

export default async function ReportPage() {
  const t = await getTranslations("report");
  return (
    <div className="">
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ReportTable />
        </CardContent>
      </Card>
    </div>
  );
}
