import { JobCardSkeleton } from "@/components/JobCardSkeleton";

export default function JobsLoading() {
  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight dark:text-gray-100 mb-8">
        Available Jobs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
