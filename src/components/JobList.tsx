import { JobListing } from "@/types";
import JobCard from "./JobCard";

interface JobListProps {
  jobs: JobListing[];
  totalCount?: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function JobList({ jobs, totalCount, selectedId, onSelect }: JobListProps) {
  // Requirement: Meaningful, domain-specific empty state 
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 mt-6 dark:bg-gray-800/50 dark:border-gray-800">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No open positions</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          We couldn't find any job listings at the moment. Please check back later for new opportunities on CareerHub.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Requirement: Display result count [cite: 102] */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""} {totalCount ? `of ${totalCount}` : ""}
        </p>
      </div>

      {/* Requirement: Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job.id} // Requirement: Key derived from job id, not index 
            job={job}
            isSelected={job.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}