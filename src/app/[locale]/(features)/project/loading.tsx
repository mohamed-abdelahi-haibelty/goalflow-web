import { Skeleton } from "@/components/ui/skeleton";

function loading() {
  return (
    <div className="space-y-4 max-w-[450px] mx-auto">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="flex space-x-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2 w-64">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <Skeleton key={cardIndex} className="h-20 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default loading;
