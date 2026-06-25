"use client";

import { useEffect } from "react";

export default function JobError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-extrabold text-red-600 dark:text-red-400 mb-4">
        Something went wrong
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md text-center">
        {error.message || "An unexpected error occurred while loading this job."}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
