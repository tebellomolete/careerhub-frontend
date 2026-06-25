// Define the union type based on the backend enum serialization
export type EmploymentType = "FullTime" | "PartTime" | "Contract" | "Internship";

export interface JobListing {
  id: string;              // GUID format, lowercase hyphenated
  title: string;
  company: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  postedAt: string;        // ISO 8601 date format
  isActive: boolean;
  applicantCount: number;
  hasApplied?: boolean; // Stretch B: Optimistic UI flag
  description?: string;
}

export interface ApplicationRequest {
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  phone?: string;
  yearsOfExperience: number;
  coverLetter: string;
  linkedInUrl?: string;
  availableImmediately: boolean;
  noticePeriodWeeks?: number;
}

export interface ApplicationResponse {
  id: string;
  jobId: string;
  email: string;
  submittedAt: string;
}