import Link from "next/link";
import { JobListing } from "@/types";
import CloseJobButton from "./CloseJobButton";
import JobLinkCard from "./JobLinkCard";

interface ListingsTableProps {
  jobs: JobListing[];
  view: 'table' | 'grid';
  showClosedJobs: boolean;
  role?: string;
}

export default function ListingsTable({ jobs, view, showClosedJobs, role }: ListingsTableProps) {
  const displayJobs = showClosedJobs ? jobs : jobs.filter((job) => job.isActive);

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Total jobs: {displayJobs.length}
      </p>
      
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayJobs.map((job) => (
            <div key={job.id} className="relative">
              <JobLinkCard job={job} />
              {role === "employer" && (
                /* Defense in depth: Check role before rendering the close button UI */
                <div className="absolute top-4 right-4 z-10">
                  <CloseJobButton jobId={job.id} isActive={job.isActive} />
                </div>
              )}
            </div>
          ))}
          {displayJobs.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              No jobs found.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Company</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Applications</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {displayJobs.map((job) => (
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
                  <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400 font-medium">
                    {job.applicantCount}
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium mr-4"
                    >
                      View
                    </Link>
                    {role === "employer" && (
                      /* Defense in depth: Check role before rendering the close button UI */
                      <CloseJobButton jobId={job.id} isActive={job.isActive} />
                    )}
                  </td>
                </tr>
              ))}
              {displayJobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}

export function ListingsTableSkeleton() {
  return (
    <div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4 animate-pulse"></div>
      <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></th>
                <th className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></th>
                <th className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></th>
                <th className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></th>
                <th className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div></th>
                <th className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 ml-auto"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-auto"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
