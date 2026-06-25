import Link from "next/link";
import { JobListing } from "@/types";

export default async function DashboardListingsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs`, {
    cache: "no-store",
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Manage Job Listings
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Total jobs: {jobs.length}
      </p>

      <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Company</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {job.company}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {job.location}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {job.isActive ? "Active" : "Closed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
