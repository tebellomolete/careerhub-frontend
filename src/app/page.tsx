"use client";

import { useState, useEffect } from "react";
import { JobListing } from "@/types";
import JobList from "@/components/JobList";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/lib/api";
import { JobListSkeleton } from "@/components/JobCardSkeleton";

// Hardcoded mock data strictly matching the JobListing interface
const MOCK_JOBS: JobListing[] = [
  {
    id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
    title: "Junior Backend Developer (.NET Core)",
    company: "Bitcube",
    location: "Bloemfontein",
    employmentType: "FullTime",
    salaryMin: 25000,
    salaryMax: 35000,
    postedAt: new Date().toISOString(), // Posted today
    isActive: true,
    applicantCount: 14,
  },
  {
    id: "b2c3d4e5-f6a7-8901-2345-6789abcdef01",
    title: "Frontend Web Developer (React)",
    company: "TechBridge Solutions",
    location: "Remote",
    employmentType: "Contract",
    salaryMin: 40000,
    salaryMax: 60000,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isActive: true,
    applicantCount: 0, // Requirement: At least one with 0 applicants
  },
  {
    id: "c3d4e5f6-a7b8-9012-3456-789abcdef012",
    title: "Software Development Intern",
    company: "Innovate Pretoria",
    location: "Pretoria",
    employmentType: "Internship",
    salaryMin: 8000,
    salaryMax: 12000,
    postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: false, // Requirement: At least one inactive
    applicantCount: 89,
  },
  {
    id: "d4e5f6a7-b8c9-0123-4567-89abcdef0123",
    title: "Database Administrator (PostgreSQL)",
    company: "DataSys SA",
    location: "Johannesburg",
    employmentType: "FullTime",
    salaryMin: 55000,
    salaryMax: 75000,
    postedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // Requirement: > 30 days ago
    isActive: true,
    applicantCount: 5,
  },
  {
    id: "e5f6a7b8-c9d0-1234-5678-9abcdef01234",
    title: "IT Support Specialist",
    company: "Spur Corporation",
    location: "Cape Town",
    employmentType: "PartTime",
    salaryMin: 15000,
    salaryMax: 22000,
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    applicantCount: 42,
  },
  {
    id: "f6a7b8c9-d0e1-2345-6789-abcdef012345",
    title: "Senior Full Stack Engineer",
    company: "FinTech Africa",
    location: "Remote",
    employmentType: "FullTime",
    salaryMin: 80000,
    salaryMax: 110000,
    postedAt: new Date().toISOString(), // Posted today
    isActive: true,
    applicantCount: 3,
  }
];

export default function Home() {
  const {
    data: jobs,
    isPending,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  // Lifted state: Home owns the selected ID, as argued in Part 1
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // --- State Persistence (SessionStorage) ---

  // Effect 1: Read from sessionStorage strictly on mount.
  // Separation rationale: We only want to read from storage when the component first mounts.
  // If we combined read/write, we might accidentally overwrite a valid selectedId with a stale storage value on subsequent re-renders.
  // Dependency array is empty [] to ensure this runs exactly once.
  useEffect(() => {
    const storedId = sessionStorage.getItem("selectedJobId");
    if (storedId) {
      // Ignore stale IDs by ensuring it exists in our current data
      const isValid = MOCK_JOBS.some(job => job.id === storedId);
      if (isValid) {
        setSelectedId(storedId);
      }
    }
  }, []); // Runs exactly once on mount

  // Effect 2: Write to sessionStorage whenever selectedId changes.
  // Separation rationale: Writing is reactive to state changes. 
  // Putting this in a separate effect guarantees it only fires when selectedId actually updates.
  // Dependency array contains [selectedId] so it synchronizes storage with React state.
  useEffect(() => {
    if (selectedId) {
      sessionStorage.setItem("selectedJobId", selectedId);
    } else {
      sessionStorage.removeItem("selectedJobId");
    }
  }, [selectedId]); // Runs whenever selectedId changes

  // Requirement: Clicking an already selected card deselects it
  const handleSelectJob = (id: string) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  // Find the full job object for the summary panel
  const selectedJob = MOCK_JOBS.find((job) => job.id === selectedId);

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight dark:text-gray-100">
          CareerHub
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Find your next role in South Africa's tech industry.
        </p>
      </div>

      {/* Requirement: Summary panel must NOT exist in the DOM when no job is selected.
        Using the && operator here ensures React completely unmounts the element, 
        rather than just hiding it with CSS. 
      */}
      {selectedJob && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm dark:bg-blue-900/20 dark:border-blue-800">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1 dark:text-blue-400">
            Currently Selected
          </h2>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedJob.title}</h3>
          <p className="text-gray-700 mt-1 dark:text-gray-300">{selectedJob.company}</p>
        </div>
      )}

      <JobList
        jobs={MOCK_JOBS}
        selectedId={selectedId}
        onSelect={handleSelectJob}
      />
    </main>
  );
}