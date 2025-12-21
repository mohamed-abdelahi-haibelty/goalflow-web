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
