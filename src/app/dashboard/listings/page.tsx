import { Suspense } from "react";
import ApplicationsSummary, { ApplicationsSummarySkeleton } from "@/components/ApplicationsSummary";
import ListingsTable, { ListingsTableSkeleton } from "@/components/ListingsTable";

export default function DashboardListingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Manage Job Listings
      </h1>
      
      <Suspense fallback={<ApplicationsSummarySkeleton />}>
        <ApplicationsSummary />
      </Suspense>

      <Suspense fallback={<ListingsTableSkeleton />}>
        <ListingsTable />
      </Suspense>
    </div>
  );
}
