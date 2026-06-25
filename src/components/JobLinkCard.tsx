import Link from "next/link";
import { JobListing } from "@/types";
import JobStatusBadge from "./JobStatusBadge";

interface JobLinkCardProps {
  job: JobListing;
}

export default function JobLinkCard({ job }: JobLinkCardProps) {
  return (
    <Link href={`/jobs/${job.id}`} className="block h-full group">
      <div className="flex flex-col justify-between p-6 rounded-lg border bg-white shadow-sm transition-all duration-200 overflow-hidden dark:bg-gray-900 h-full border-gray-200 group-hover:border-blue-300 group-hover:shadow-md dark:border-gray-800 dark:group-hover:border-blue-700">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {job.title}
            </h2>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {job.company} &middot; {job.location}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <JobStatusBadge employmentType={job.employmentType} isActive={job.isActive} />
          </div>
        </div>
      </div>
    </Link>
  );
}
