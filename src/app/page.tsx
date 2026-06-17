"use client";

import { useState } from "react";
import { JobListing } from "@/types";
import JobList from "@/components/JobList";

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
  // Lifted state: Home owns the selected ID, as argued in Part 1
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Requirement: Clicking an already selected card deselects it
  const handleSelectJob = (id: string) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  // Find the full job object for the summary panel
  const selectedJob = MOCK_JOBS.find((job) => job.id === selectedId);

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          CareerHub
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Find your next role in South Africa's tech industry.
        </p>
      </div>

      {/* Requirement: Summary panel must NOT exist in the DOM when no job is selected.
        Using the && operator here ensures React completely unmounts the element, 
        rather than just hiding it with CSS. 
      */}
      {selectedJob && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">
            Currently Selected
          </h2>
          <h3 className="text-xl font-bold text-gray-900">{selectedJob.title}</h3>
          <p className="text-gray-700 mt-1">{selectedJob.company}</p>
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