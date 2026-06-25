import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-65px)]">
      <aside className="w-full md:w-64 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-800 p-6 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Employer Dashboard
        </h2>
        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard/listings"
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 rounded-md dark:text-blue-400 dark:bg-blue-900/10 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
          >
            Job Listings
          </Link>
          <Link
            href="/jobs"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            View Public Site
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
