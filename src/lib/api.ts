import { JobListing } from "@/types";

export interface PaginatedJobs {
  jobs: JobListing[];
  totalPages: number;
  totalCount: number;
}

export async function fetchJobs(page: number = 1): Promise<PaginatedJobs> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${baseUrl}/api/v1/Jobs?page=${page}&pageSize=21`);

  if (!res.ok) {
    throw new Error(`Failed to fetch jobs: ${res.status} ${res.statusText}`);
  }

  const responseData = await res.json();

  // Extract the array portion of the paginated response and map the properties
  // to match the frontend JobListing interface exactly.
  const jobs: JobListing[] = responseData.data.map((job: any) => {
    // Parse the salary display string (e.g. "R117 000 - R137 000/month")
    // by removing all non-digits and non-dashes, then splitting.
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
      company: job.companyName,       // Map companyName -> company
      location: job.location,
      employmentType: job.type,       // Map type -> employmentType
      salaryMin,                      // Parsed from salaryDisplay
      salaryMax,                      // Parsed from salaryDisplay
      postedAt: job.postedAt,
      isActive: true,                 // Backend doesn't provide this, defaulting to true
      applicantCount: job.applicationCount // Map applicationCount -> applicantCount
    };
  });

  const totalCount = parseInt(res.headers.get("X-Total-Count") || "0", 10);
  const totalPages = Math.ceil(totalCount / 21);

  return { jobs, totalPages, totalCount };
}
