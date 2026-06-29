"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { useEffect, useState } from "react";

export default function DashboardToolbar() {
  const [mounted, setMounted] = useState(false);
  const view = useDashboardStore((state) => state.view);
  const showClosedJobs = useDashboardStore((state) => state.showClosedJobs);
  const setView = useDashboardStore((state) => state.setView);
  const setShowClosedJobs = useDashboardStore((state) => state.setShowClosedJobs);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[72px] mb-6 bg-transparent" />;
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showClosedJobs}
            onChange={(e) => setShowClosedJobs(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-900"
          />
          <span>Show Closed Jobs</span>
        </label>
      </div>
      <div className="flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => setView('table')}
          className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
            view === 'table' 
              ? 'bg-gray-100 text-blue-700 border-gray-300 dark:bg-gray-800 dark:text-blue-400 dark:border-gray-700 z-10' 
              : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800'
          }`}
        >
          Table
        </button>
        <button
          type="button"
          onClick={() => setView('grid')}
          className={`px-4 py-2 text-sm font-medium border border-l-0 rounded-r-lg ${
            view === 'grid' 
              ? 'bg-gray-100 text-blue-700 border-gray-300 dark:bg-gray-800 dark:text-blue-400 dark:border-gray-700 z-10' 
              : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800'
          }`}
        >
          Grid
        </button>
      </div>
    </div>
  );
}
