import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] max-w-4xl mx-auto px-4 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight dark:text-gray-100 mb-6">
        Welcome to CareerHub
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
        The premier destination for connecting top talent with the best tech opportunities in South Africa.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Link
          href="/jobs"
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-lg"
        >
          Find a Job
        </Link>
        <Link
          href="/dashboard/listings"
          className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 hover:border-blue-300 dark:bg-gray-900 dark:text-blue-400 dark:border-blue-800 dark:hover:border-blue-700 font-semibold rounded-lg shadow-sm transition-colors text-lg"
        >
          Post a Job
        </Link>
      </div>
    </main>
  );
}