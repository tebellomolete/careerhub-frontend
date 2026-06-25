import Link from "next/link";

export default function JobNotFound() {
  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight dark:text-gray-100 mb-4">
        Job Not Found
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
        The job posting you are looking for does not exist or has been removed.
      </p>
      <Link
        href="/jobs"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
      >
        Browse all jobs
      </Link>
    </main>
  );
}
