import { JobListing } from "@/types";
import JobLinkCard from "@/components/JobLinkCard";

export default async function JobsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const jobs: JobListing[] = await res.json();

  if (jobs.length === 0) {
    return (
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight dark:text-gray-100 mb-8">
          Available Jobs
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No jobs available at the moment.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight dark:text-gray-100 mb-8">
        Available Jobs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobLinkCard key={job.id} job={job} />
        ))}
      </div>
    </main>
  );
}
