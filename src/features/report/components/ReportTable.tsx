"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, Clock } from "lucide-react";
import { toast } from "sonner";
import { DateFilter, ProjectReport } from "@/features/report/types/report";
import { useReportColumns } from "@/features/report/components/ReportColumns";

import { DataTable } from "@/components/shared/DataTable";
import { cn } from "@/lib/utils";
import { ActivityHeatmap } from "@/features/report/components/ActivityHeatmap";
import { ProjectComparisonChart } from "@/features/report/components/ProjectComparisonChart";
import {
  type ReportDataPayload,
  getReports,
} from "@/features/report/actions/getReport";
import { useSearchParams } from "next/navigation";

export function ReportTable() {
  const t = useTranslations("report");
  const [result, setResult] = useState<{
    key: string;
    data: ReportDataPayload | null;
  }>({ key: "", data: null });
  const [dateFilter, setDateFilter] = useState<DateFilter | undefined>();
  const columns = useReportColumns();

  // 2. Get the year from URL
  const searchParams = useSearchParams();
  const yearParam = searchParams.get("year");
  const selectedYear = yearParam
    ? parseInt(yearParam)
    : new Date().getFullYear();

  const queryKey = `${selectedYear}/${dateFilter ?? "all"}`;
  const loading = result.key !== queryKey;
  const data = result.data?.tableData ?? [];
  const heatmapData = result.data?.heatmapData ?? [];
  const chartData = result.data?.chartData ?? [];

  useEffect(() => {
    let active = true;
    getReports({
      dateFilter,
      year: selectedYear,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
      .then((response) => {
        if (!active) return;
        setResult({
          key: queryKey,
          data: response.success ? (response.data ?? null) : null,
        });
        if (!response.success) toast.error(response.message);
      })
      .catch(() => {
        if (!active) return;
        setResult({ key: queryKey, data: null });
        toast.error(t("error.fetchFailed"));
      });
    return () => {
      active = false;
    };
  }, [dateFilter, selectedYear, queryKey, t]);

  const handleFilterChange = (filter: DateFilter | undefined) => {
    setDateFilter(filter);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-8 transition-opacity duration-500">
        {/* Top Section: Heatmap & Charts */}
        <div className="grid grid-cols-1  gap-8">
          <div className="space-y-4 lg:mx-auto">
            {/* Heatmap Section */}
            <div className="p-4 rounded-xl bg-card">
              <ActivityHeatmap data={heatmapData} />
            </div>
          </div>
        </div>

        <div className="h-px bg-border  my-6" />

        {/* Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold">{t("detailsTitle")}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={dateFilter === undefined ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(undefined)}
                className={cn(
                  "gap-2",
                  dateFilter === undefined ? "" : "bg-card",
                )}
              >
                <Calendar className="size-4" />
                {t("filters.allTime")}
              </Button>
              <Button
                variant={dateFilter === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("today")}
                className={cn("gap-2", dateFilter === "today" ? "" : "bg-card")}
              >
                <Clock className="size-4" />
                {t("filters.today")}
              </Button>
              <Button
                variant={dateFilter === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("week")}
                className={cn("gap-2", dateFilter === "week" ? "" : "bg-card")}
              >
                <CalendarDays className="size-4" />
                {t("filters.thisWeek")}
              </Button>
              <Button
                variant={dateFilter === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("month")}
                className={cn("gap-2", dateFilter === "month" ? "" : "bg-card")}
              >
                <Calendar className="size-4" />
                {t("filters.thisMonth")}
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <DataTable<ProjectReport, unknown>
            columns={columns}
            data={data}
            searchColumns={["projectName"]}
            searchPlaceholder={t("searchPlaceholder")}
          />
        </div>

        {/* Project Comparison Chart */}
        <ProjectComparisonChart data={chartData} />
      </div>
    </div>
  );
}
