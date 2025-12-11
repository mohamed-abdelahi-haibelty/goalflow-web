"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PomodoroSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center text-foreground ">
      {/* Back button + task title */}
      <div className="w-full max-w-md mb-4 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-40 rounded-md" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-6 w-48 rounded-md" />
        </div>
      </div>

      {/* Mode switcher skeleton */}
      <div className="flex rounded-full bg-card p-1 mb-12 border-dashed border">
        <Skeleton className="h-9 w-28 rounded-full mx-1" />
        <Skeleton className="h-9 w-28 rounded-full mx-1" />
        <Skeleton className="h-9 w-32 rounded-full mx-1" />
      </div>

      {/* Timer circle placeholder */}
      <div className="relative w-80 h-80 flex items-center justify-center mb-8">
        <div className="absolute w-full h-full rounded-full bg-white  shadow-inner"></div>

        <div className="absolute flex flex-col items-center">
          <Skeleton className="h-14 w-32 mb-3 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
      </div>

      {/* Buttons (Reset + Settings) */}
      <div className="flex gap-4 mt-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Completed sessions */}
      <Skeleton className="h-4 w-32 mt-4 rounded-md" />
    </div>
  );
}
