export interface ProjectReport {
  id: string;
  projectName: string;
  totalHours: number; // Stored as seconds
  taskCount: number;
  completedTasks: number;
}

export type DateFilter = "today" | "week" | "month";

export interface ReportFilters {
  dateFilter?: DateFilter;
  searchQuery?: string;
}

export interface HeatmapData {
  /** The date in 'YYYY-MM-DD' format */
  date: string;
  /** The number of pomodoro sessions completed on this day */
  count: number;
  /** Total duration in seconds for this day */
  duration: number;
}
