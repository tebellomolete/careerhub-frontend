"use client";

import { useQueryStates, parseAsString } from 'nuqs';
import { useState, useEffect } from 'react';

export default function JobFilters() {
  const [queryStates, setQueryStates] = useQueryStates({
    q: parseAsString.withDefault(''),
    location: parseAsString.withDefault(''),
    status: parseAsString.withDefault('all'),
  }, {
    shallow: false,
  });

  const [localQ, setLocalQ] = useState(queryStates.q);
  const [localLocation, setLocalLocation] = useState(queryStates.location);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQueryStates({ 
        q: localQ || null, 
        location: localLocation || null 
      });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localQ, localLocation, setQueryStates]);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mb-8 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label htmlFor="q" className="sr-only">Keywords</label>
        <input
          id="q"
          type="text"
          placeholder="Search jobs or companies..."
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="location" className="sr-only">Location</label>
        <input
          id="location"
          type="text"
          placeholder="City, state, or remote..."
          value={localLocation}
          onChange={(e) => setLocalLocation(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="sm:w-48">
        <label htmlFor="status" className="sr-only">Status</label>
        <select
          id="status"
          value={queryStates.status}
          onChange={(e) => setQueryStates({ status: e.target.value === 'all' ? null : e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Jobs</option>
          <option value="open">Open Only</option>
        </select>
      </div>
    </div>
  );
}
