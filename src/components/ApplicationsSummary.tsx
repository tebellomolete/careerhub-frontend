import React from "react";

interface AppStats {
  jobId: string;
  applicationCount: number;
}

export default async function ApplicationsSummary() {
  const res = await fetch(`http://localhost:3000/api/applications/stats`, {
    cache: "no-store",
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch application stats");
  }

  const stats: AppStats[] = await res.json();
  const totalApplications = stats.reduce((sum, stat) => sum + stat.applicationCount, 0);

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Applications</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalApplications}</p>
    </div>
  );
}

export function ApplicationsSummarySkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
    </div>
  );
}
