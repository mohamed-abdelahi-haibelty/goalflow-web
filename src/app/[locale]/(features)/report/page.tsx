import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportTable } from "./ui/ReportTable";
import { getUserSession } from "@/actions/auth/getUserSession";
import db from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { hasProAccess } from "@/lib/plan-utils";

export default async function ReportPage() {
  const t = await getTranslations("report");
  const session = await getUserSession();

  const userId = session?.user?.id || "";
  const userEmail = session?.user?.email || "";

  let isPro = false;
  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });
    isPro = hasProAccess(user);
  }

  return (
    <div className="">
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ReportTable isPro={isPro} userId={userId} userEmail={userEmail} />
        </CardContent>
      </Card>
    </div>
  );
}
