import { JobListing } from "@/types";
import { cn } from "@/lib/utils";
import JobStatusBadge from "./JobStatusBadge";

interface JobCardProps {
  job: JobListing;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

// Utility to calculate relative time
function getRelativeTime(dateString: string): string {
  const posted = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - posted.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}

export default function JobCard({ job, isSelected, onSelect }: JobCardProps) {
  // Format numbers with spaces for ZA locale
  const formatSalary = (amount: number) => amount.toLocaleString("en-ZA");

  return (
    <div
      onClick={() => onSelect(job.id)}
      className={cn(
        "relative p-5 rounded-lg border cursor-pointer transition-all overflow-hidden",
        // Selected state styling
        isSelected && "border-blue-600 bg-blue-50 ring-1 ring-blue-600 dark:bg-blue-900/20 dark:border-blue-500 dark:ring-blue-500",
        // Default styling (active & unselected)
        !isSelected && job.isActive && "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600",
        // Expired styling (inactive & unselected) visually distinct
        !isSelected && !job.isActive && "border-gray-200 bg-gray-50 opacity-75 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700"
      )}
    >
      {job.hasApplied && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-sm">
          Applied
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{job.title}</h2>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {job.company} &middot; {job.location}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <JobStatusBadge employmentType={job.employmentType} isActive={job.isActive} />
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          R{formatSalary(job.salaryMin)} - R{formatSalary(job.salaryMax)} pm
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {getRelativeTime(job.postedAt)}
        </span>
      </div>

      {/* CRITICAL FIX: job.applicantCount > 0 prevents the number 0 from rendering in the DOM
        when the count is 0, addressing the trap mentioned in Part 1 of the spec. 
      */}
      {job.applicantCount > 0 && (
        <p className="text-sm text-gray-500 font-medium dark:text-gray-400">
          {job.applicantCount} applicant{job.applicantCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}