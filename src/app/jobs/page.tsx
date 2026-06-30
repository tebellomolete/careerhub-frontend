import Link from "next/link";
import { JobListing } from "@/types";
import JobLinkCard from "@/components/JobLinkCard";
import JobFilters from "@/components/JobFilters";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q.toLowerCase() : '';
  const location = typeof resolvedParams.location === 'string' ? resolvedParams.location.toLowerCase() : '';
  const status = typeof resolvedParams.status === 'string' ? resolvedParams.status : 'all';

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs`, {
    next: { tags: ["jobs"] },
  });

  if (!res.ok) {
    console.error(`Failed to fetch jobs: ${res.status} ${res.statusText}`);
    throw new Error("Failed to fetch jobs");
  }

  const responseData = await res.json();
  const jobs: JobListing[] = responseData.data.map((job: any) => {
    let salaryMin = 0;
    let salaryMax = 0;
    if (job.salaryDisplay) {
      const parts = job.salaryDisplay.replace(/[^\d-]/g, "").split("-");
      if (parts.length >= 2) {
        salaryMin = parseInt(parts[0], 10) || 0;
        salaryMax = parseInt(parts[1], 10) || 0;
      }
    }

    return {
      id: job.id,
      title: job.title,
      company: job.companyName,
      location: job.location,
      employmentType: job.type,
      salaryMin,
      salaryMax,
      postedAt: job.postedAt,
      isActive: true,
      applicantCount: job.applicationCount,
    };
  });

  let filteredJobs = jobs;

  if (q) {
    filteredJobs = filteredJobs.filter((job) =>
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q)
    );
  }

  if (location) {
    filteredJobs = filteredJobs.filter((job) =>
      job.location.toLowerCase().includes(location)
    );
  }

  if (status === "open") {
    filteredJobs = filteredJobs.filter((job) => job.isActive);
  }

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight dark:text-gray-100 mb-8">
        Available Jobs
      </h1>
      
      <JobFilters />

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No jobs are currently listed.</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No jobs match your search.</p>
          <Link href="/jobs" className="inline-flex py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Clear all filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobLinkCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </main>
  );
}
