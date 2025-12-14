import { Skeleton } from "@/components/ui/skeleton";

// Complete page skeleton including sidebar and layout
export function ProjectPageSkeleton() {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar Skeleton */}
      <aside className="w-64 border-r bg-background flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-4 space-y-6">
          {/* App Name Section */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Sidebar Footer (User) */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <header className="h-16 border-b flex items-center gap-2 px-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-6 w-px" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-1 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="ml-auto">
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </header>

        {/* Kanban Board Content */}
        <main className="flex-1 overflow-auto p-4">
          <div className="flex gap-4 h-full">
            {/* Three columns */}
            {["Todo", "In progress", "Done"].map((_, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-80 space-y-3 bg-muted/40 rounded-lg p-4"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-5 rounded" />
                </div>

                {/* Add Task Button */}
                <div className="flex items-center gap-2 p-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>

                {/* Task Card Skeletons */}
                {idx === 0 && (
                  <div className="space-y-3 mt-4">
                    {[1, 2].map((card) => (
                      <div
                        key={card}
                        className="bg-card border rounded-md p-4 space-y-2"
                      >
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <div className="flex items-center gap-2 pt-2">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Add Column Button */}
            <div className="flex-shrink-0 w-80 flex items-start justify-center pt-4">
              <div className="flex items-center gap-2 p-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Alternative: Using SidebarProvider structure (matching your actual layout)
export function ProjectLayoutSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="h-16 border-b flex items-center px-4">
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-1">
            <Skeleton className="h-10 w-full rounded-md mb-4" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>

          {/* User Profile */}
          <div className="h-16 border-t flex items-center gap-3 px-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 border-b">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-4 w-px" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-1 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto px-4 py-4">
          <KanbanBoardSkeleton />
        </main>
      </div>
    </div>
  );
}

// Just the Kanban board skeleton (for use inside layout)
export function KanbanBoardSkeleton() {
  return (
    <div className="flex gap-4 pb-4">
      {/* Three columns */}
      {[1, 2, 3].map((col) => (
        <div
          key={col}
          className="flex-shrink-0 w-80 space-y-3 bg-muted/40 rounded-lg p-4"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>

          {/* Add Task Button */}
          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/60">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Task Cards (only show in first column) */}
          {col === 1 && (
            <div className="space-y-3 mt-4">
              {[1, 2].map((task) => (
                <div
                  key={task}
                  className="bg-card border rounded-md p-4 space-y-2 shadow-sm"
                >
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <div className="flex items-center gap-2 pt-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add Column Button */}
      <div className="flex-shrink-0 flex items-start pt-4">
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/60">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}
