"use client";

import { formatTimeSpentWithTranslations } from "@/lib/timeUtils";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { ProjectReport } from "../types/report";

const columnHelper = createColumnHelper<ProjectReport>();

export const useReportColumns = () => {
  const t = useTranslations("report");

  return [
    columnHelper.accessor("projectName", {
      header: () => t("columns.projectName"),
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor("totalHours", {
      header: () => t("columns.timeSpent"),
      cell: (info) => {
        const seconds = info.getValue();
        const formattedTime = formatTimeSpentWithTranslations(seconds, {
          hours: t("time.hours"),
          minutes: t("time.minutes"),
          seconds: t("time.seconds"),
          noTime: t("time.noTime"),
        });

        return <div className="text-muted-foreground">{formattedTime}</div>;
      },
    }),
    columnHelper.accessor("taskCount", {
      header: () => t("columns.taskCount"),
      cell: (info) => <div className="">{info.getValue()}</div>,
    }),
    columnHelper.accessor("completedTasks", {
      header: () => t("columns.completedTasks"),
      cell: (info) => {
        const completed = info.getValue();
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
    }),
  ];
};
