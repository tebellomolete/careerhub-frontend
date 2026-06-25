"use client";

import { useState, useEffect } from "react";
import { JobListing } from "@/types";
import JobList from "@/components/JobList";
import { Pagination } from "@/components/Pagination";
import ApplicationForm from "@/components/ApplicationForm";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/lib/api";
import { JobListSkeleton } from "@/components/JobCardSkeleton";

// Hardcoded mock data has been moved to src/app/api/jobs/route.ts

export default function Home() {
  const [page, setPage] = useState(1);

  const {
    data: paginatedJobs,
    isPending,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["jobs", page],
    queryFn: () => fetchJobs(page),
  });

  const jobs = paginatedJobs?.jobs || [];
  const totalPages = paginatedJobs?.totalPages || 1;
  const totalCount = paginatedJobs?.totalCount || 0;

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
      // Trust the stored ID initially, validation will happen implicitly if the ID is missing from fetched jobs
      setSelectedId(storedId);
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

  // Effect 3: Smooth scroll to top when a job is selected
  useEffect(() => {
    if (selectedId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedId]);

  // Requirement: Clicking an already selected card deselects it
  const handleSelectJob = (id: string) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  // Find the full job object for the summary panel
  const selectedJob = jobs?.find((job) => job.id === selectedId);

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
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 shadow-sm dark:bg-blue-900/20 dark:border-blue-800">
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1 dark:text-blue-400">
              Currently Selected
            </h2>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedJob.title}</h3>
            <p className="text-gray-700 mt-1 dark:text-gray-300">{selectedJob.company}</p>
          </div>
          <ApplicationForm jobId={selectedJob.id} jobTitle={selectedJob.title} />
        </div>
      )}

      {isPending && <JobListSkeleton />}

      {isError && (
        <div className="mt-6 p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-center">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Failed to load jobs</h3>
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {jobs.length > 0 && !isError && !isPending && (
        <>
          <JobList
            jobs={jobs}
            totalCount={totalCount}
            selectedId={selectedId}
            onSelect={handleSelectJob}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </main>
  );
}