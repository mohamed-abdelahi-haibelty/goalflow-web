"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, Clock } from "lucide-react";
import { toast } from "sonner";
import { DateFilter, ProjectReport } from "../types/report";
import { useReportColumns } from "./ReportColumns";

import { DataTable } from "@/components/shared/DataTable";
import { cn } from "@/lib/utils";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { ProjectComparisonChart } from "./ProjectComparisonChart";
import { getReports } from "../action/getReport";

export function ReportTable() {
  const t = useTranslations("report");
  const [data, setData] = useState<ProjectReport[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter | undefined>();
  const columns = useReportColumns();

  const fetchReports = async (filter?: DateFilter) => {
    try {
      setLoading(true);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await getReports({
        dateFilter: filter,
        timezone,
      });

      if (response.success && response.data) {
        setData(response.data.tableData);
        setHeatmapData(response.data.heatmapData);
        setChartData(response.data.chartData);
      } else {
        toast.error(response.message);
        setData([]);
      }
    } catch (error) {
      toast.error(t("error.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(dateFilter);
  }, [dateFilter]);

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
    <div className="space-y-8">
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
              className={cn("gap-2", dateFilter === undefined ? "" : "bg-card")}
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
        <DataTable<ProjectReport, any>
          columns={columns}
          data={data}
          searchColumns={["projectName"]}
          searchPlaceholder={t("searchPlaceholder")}
        />
      </div>

      {/* Project Comparison Chart */}
      <ProjectComparisonChart data={chartData} />
    </div>
  );
}
