"use client";

import { useTranslations } from "next-intl";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  subDays,
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  getDay,
  subWeeks,
} from "date-fns";
import { HeatmapData } from "../action/getReport";

interface ActivityHeatmapProps {
  data: HeatmapData[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const t = useTranslations("report.heatmap");

  // 1. Generate Calendar Grid (Last ~52 weeks)
  const today = new Date();
  // Start 52 weeks ago, aligned to the start of that week (Sunday/Monday depending on locale preference, defaulting to Sunday here for GitHub style)
  const startDate = startOfWeek(subWeeks(today, 52));
  const endDate = today;

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Group days into weeks [ [Sun, Mon...], [Sun, Mon...] ]
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  allDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  // Push remaining partial week
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Helper: Format tooltip time
  const formatTooltipTime = (seconds: number) => {
    if (seconds === 0) return t("noActivity");
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (h > 0) return `${h}h:${m.toString().padStart(2, "0")} min`;
    return `${m} min`;
  };

  // Helper: Get color intensity
  const getColor = (duration: number) => {
    if (duration === 0) return "bg-muted/40"; // Empty
    if (duration < 15 * 60) return "bg-primary/40";
    if (duration < 60 * 60) return "bg-primary/60";
    if (duration < 120 * 60) return "bg-primary/80";
    return "bg-primary";
  };

  // Generate Month Labels
  const monthLabels: { label: string; weekIndex: number }[] = [];
  weeks.forEach((week, index) => {
    const firstDay = week[0];
    // If it's the first week or the month changed from the previous week's first day
    if (index === 0 || !isSameMonth(firstDay, weeks[index - 1][0])) {
      monthLabels.push({
        label: format(firstDay, "MMM"),
        weekIndex: index,
      });
    }
  });

  return (
    <div className="flex flex-col gap-4 w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{t("title")}</h3>
        <span className="text-xs text-muted-foreground">{t("lastYear")}</span>
      </div>

      {/* Scrollable Container for the Grid */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-max">
          {/* Month Labels Row */}
          <div className="flex text-xs text-muted-foreground mb-2 relative h-4">
            {monthLabels.map((m, i) => (
              // Approximate positioning based on week width (w-3 + gap-1 = 1rem roughly)
              <span
                key={`${m.label}-${i}`}
                className="absolute"
                style={{ left: `${m.weekIndex * 14}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day Labels (Mon/Wed/Fri) */}
            <div className="flex flex-col gap-1 pr-2 text-[10px] text-muted-foreground leading-3 pt-[2px]">
              <div className="h-3"></div> {/* Sun placeholder */}
              <div className="h-3">Mon</div>
              <div className="h-3"></div>
              <div className="h-3">Wed</div>
              <div className="h-3"></div>
              <div className="h-3">Fri</div>
              <div className="h-3"></div>
            </div>

            {/* The Grid */}
            <TooltipProvider delayDuration={50}>
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day) => {
                      const dateKey = format(day, "yyyy-MM-dd");
                      const dayData = data.find((d) => d.date === dateKey) || {
                        count: 0,
                        duration: 0,
                      };

                      return (
                        <Tooltip key={dateKey}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "h-3 w-3 rounded-sm duration-150   transition-colors hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background",
                                getColor(dayData.duration)
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <div className="text-xs space-y-1">
                              <p className="font-semibold ">
                                {format(day, "PPP")}
                              </p>
                              <div className="flex flex-col gap-0.5">
                                <span>
                                  {t("timeWorked")}:{" "}
                                  <span>
                                    {formatTooltipTime(dayData.duration)}
                                  </span>
                                </span>
                                <span>
                                  {t("sessions")}: <span>{dayData.count}</span>
                                </span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-muted/40" />
        <div className="h-3 w-3 rounded-sm bg-primary/40" />
        <div className="h-3 w-3 rounded-sm bg-primary/60" />
        <div className="h-3 w-3 rounded-sm bg-primary/80" />
        <div className="h-3 w-3 rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
}
