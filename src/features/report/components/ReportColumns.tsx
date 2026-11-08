"use client";

import { formatTimeSpentWithTranslations } from "@/lib/timeUtils";
import { type ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { ProjectReport } from "@/features/report/types/report";

export const useReportColumns = (): ColumnDef<ProjectReport>[] => {
  const t = useTranslations("report");

  return [
    {
      accessorKey: "projectName",
      header: () => t("columns.projectName"),
      cell: (info) => (
        <div className="font-medium">{info.row.original.projectName}</div>
      ),
    },
    {
      accessorKey: "totalHours",
      header: () => t("columns.timeSpent"),
      cell: (info) => {
        const seconds = info.getValue<number>();
        const formattedTime = formatTimeSpentWithTranslations(seconds, {
          hours: t("time.hours"),
          minutes: t("time.minutes"),
          seconds: t("time.seconds"),
          noTime: t("time.noTime"),
        });

        return <div className="text-muted-foreground">{formattedTime}</div>;
      },
    },
    {
      accessorKey: "taskCount",
      header: () => t("columns.taskCount"),
      cell: (info) => <div className="">{info.row.original.taskCount}</div>,
    },
    {
      accessorKey: "completedTasks",
      header: () => t("columns.completedTasks"),
      cell: (info) => {
        const completed = info.getValue<number>();
        const total = info.row.original.taskCount;
        const percentage =
          total > 0 ? Math.round((completed / total) * 100) : 0;

        return (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {completed}/{total}
            </span>
            <span className="text-xs text-muted-foreground">
              ({percentage}%)
            </span>
          </div>
        );
      },
    },
  ];
};
