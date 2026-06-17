import { JobListing, EmploymentType } from "@/types";

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

// Map the union type to visually distinct Tailwind classes
const badgeStyles: Record<EmploymentType, string> = {
  FullTime: "bg-blue-100 text-blue-800",
  PartTime: "bg-green-100 text-green-800",
  Contract: "bg-orange-100 text-orange-800",
  Internship: "bg-purple-100 text-purple-800",
};

export default function JobCard({ job, isSelected, onSelect }: JobCardProps) {
  // Format numbers with spaces for ZA locale
  const formatSalary = (amount: number) => amount.toLocaleString("en-ZA");

  return (
    <div
      onClick={() => onSelect(job.id)}
      className={`p-5 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
        
        {/* Render Expired badge only if isActive is false */}
        {!job.isActive && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Expired
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {job.company} &middot; {job.location}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            badgeStyles[job.employmentType]
          }`}
        >
          {job.employmentType}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          R{formatSalary(job.salaryMin)} - R{formatSalary(job.salaryMax)} pm
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {getRelativeTime(job.postedAt)}
        </span>
      </div>

      {/* CRITICAL FIX: job.applicantCount > 0 prevents the number 0 from rendering in the DOM
        when the count is 0, addressing the trap mentioned in Part 1 of the spec. 
      */}
      {job.applicantCount > 0 && (
        <p className="text-sm text-gray-500 font-medium">
          {job.applicantCount} applicant{job.applicantCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}