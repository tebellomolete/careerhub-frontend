export default function JobsLoading() {
  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight dark:text-gray-100 mb-8">
        Available Jobs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-6 rounded-lg border bg-white shadow-sm dark:bg-gray-900 h-[200px] border-gray-200 dark:border-gray-800 animate-pulse"
          >
            <div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 dark:bg-gray-700"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 dark:bg-gray-700"></div>
              <div className="flex gap-2">
                <div className="h-5 bg-gray-200 rounded w-20 dark:bg-gray-700"></div>
                <div className="h-5 bg-gray-200 rounded w-20 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
