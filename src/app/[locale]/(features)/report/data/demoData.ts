import {
  addDays,
  eachDayOfInterval,
  endOfYear,
  format,
  startOfYear,
  subDays,
} from "date-fns";
import { ProjectReport, HeatmapData } from "../types/report";

// Generate a "perfect" looking heatmap (consistent activity)
export const getDemoHeatmapData = (
  year: number = new Date().getFullYear()
): HeatmapData[] => {
  const data: HeatmapData[] = [];

  // Create range for the selected year
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));

  const allDays = eachDayOfInterval({ start, end });

  allDays.forEach((date) => {
    // Random activity level (skewed towards active)
    const isRestDay = Math.random() > 0.8;

    if (!isRestDay) {
      data.push({
        date: format(date, "yyyy-MM-dd"),
        count: Math.floor(Math.random() * 5) + 1, // 1-6 sessions
        duration: Math.floor(Math.random() * 14400) + 3600, // 1h - 5h
      });
    }
  });

  return data;
};

export const demoChartData = [
  { name: "SaaS Platform", duration: 72000 }, // 20h
  { name: "Marketing Site", duration: 36000 }, // 10h
  { name: "Mobile App", duration: 18000 }, // 5h
  { name: "Design System", duration: 7200 }, // 2h
  { name: "Blog Posts", duration: 3600 }, // 1h
];

export const demoTableData: ProjectReport[] = [
  {
    id: "1",
    projectName: "SaaS Platform Launch",
    totalHours: 72000,
    taskCount: 45,
    completedTasks: 40,
  },
  {
    id: "2",
    projectName: "Marketing Website",
    totalHours: 36000,
    taskCount: 20,
    completedTasks: 15,
  },
  {
    id: "3",
    projectName: "Mobile App MVP",
    totalHours: 18000,
    taskCount: 12,
    completedTasks: 4,
  },
  {
    id: "4",
    projectName: "Q4 Design System",
    totalHours: 7200,
    taskCount: 8,
    completedTasks: 8,
  },
  {
    id: "5",
    projectName: "Weekly Blog Posts",
    totalHours: 3600,
    taskCount: 5,
    completedTasks: 2,
  },
];
