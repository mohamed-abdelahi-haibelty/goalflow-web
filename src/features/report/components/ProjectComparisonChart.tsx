"use client";

import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  name: string;
  duration: number;
}

export function ProjectComparisonChart({ data }: { data: ChartData[] }) {
  const t = useTranslations("report.charts");

  // Helper to convert seconds to "Xh Ym"
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const chartData = data.map((d) => ({
    ...d,
    hours: parseFloat((d.duration / 3600).toFixed(1)), // Keep decimal for the bar height
    formattedTime: formatDuration(d.duration), // Human readable for the tooltip
  }));

  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  return (
    <Card className="col-span-1 border-none bg-card shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {t("projectComparison")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 25, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="4 4"
                  className="stroke-muted/50"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />

                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-card p-3 shadow-xl border-border">
                          <p className="text-sm font-bold">
                            {payload[0].payload.name}
                          </p>
                          {/* Use the beautiful human-readable time here */}
                          <p
                            className="text-sm font-medium"
                            style={{ color: payload[0].fill }}
                          >
                            {payload[0].payload.formattedTime}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                  <LabelList
                    dataKey="hours"
                    position="top"
                    formatter={(value: number) => `${value}h`} // Keeps the bar labels clean
                    style={{
                      fill: "var(--muted-foreground)",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              {t("noData")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
