import { notFound } from "next/navigation";
import Link from "next/link";
import { JobListing } from "@/types";
import ApplicationForm from "@/components/ApplicationForm";
import JobStatusBadge from "@/components/JobStatusBadge";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    console.error(`Failed to fetch job details: ${res.status} ${res.statusText}`);
    throw new Error(`Failed to fetch job details: ${res.statusText}`);
  }

  const responseData = await res.json();
  const rawJob = responseData.data || responseData;
  
  let salaryMin = 0;
  let salaryMax = 0;
  if (rawJob.salaryDisplay) {
    const parts = rawJob.salaryDisplay.replace(/[^\d-]/g, "").split("-");
    if (parts.length >= 2) {
      salaryMin = parseInt(parts[0], 10) || 0;
      salaryMax = parseInt(parts[1], 10) || 0;
    }
  } else if (rawJob.salaryMin !== undefined) {
    salaryMin = rawJob.salaryMin;
    salaryMax = rawJob.salaryMax;
  }

  const job: JobListing = {
    id: rawJob.id,
    title: rawJob.title,
    company: rawJob.companyName || rawJob.company,
    location: rawJob.location,
    employmentType: rawJob.type || rawJob.employmentType,
    salaryMin,
    salaryMax,
    postedAt: rawJob.postedAt,
    isActive: rawJob.isActive !== undefined ? rawJob.isActive : true,
    applicantCount: rawJob.applicationCount ?? rawJob.applicantCount ?? 0,
    description: rawJob.description
  };

  const formatSalary = (amount: number) => amount.toLocaleString("en-ZA");

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link
        href="/jobs"
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-6 dark:text-blue-400 dark:hover:text-blue-300"
      >
        &larr; Back to jobs
      </Link>

      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              {job.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {job.company} &middot; {job.location}
            </p>
          </div>
          <JobStatusBadge employmentType={job.employmentType} isActive={job.isActive} />
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Salary Range</p>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              R{formatSalary(job.salaryMin)} - R{formatSalary(job.salaryMax)} pm
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Applicants</p>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {job.applicantCount}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Posted</p>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {new Date(job.postedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Job Description</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {job.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="mt-8">
        {job.isActive ? (
          <ApplicationForm jobId={job.id} jobTitle={job.title} />
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center dark:bg-gray-900 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Applications Closed
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This position is no longer accepting new applications.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
