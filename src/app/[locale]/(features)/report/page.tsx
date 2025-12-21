import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportTable } from "./ui/ReportTable";

export default function ReportPage() {
  const t = useTranslations("report");

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
