import { cn } from "@/lib/utils";

export function JobCardSkeleton() {
  return (
    <div className="p-5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 animate-pulse">
      {/* Heading area */}
      <div className="flex justify-between items-start mb-2">
        <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>

      {/* Detail lines (Company & Location) */}
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 mt-2"></div>

      {/* Badge area */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>

      {/* Footer (Applicants) */}
      <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    </div>
  );
}

export function JobListSkeleton() {
  return (
    <div className="mt-6">
      <div className="mb-4">
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
