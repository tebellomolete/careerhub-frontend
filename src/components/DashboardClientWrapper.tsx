"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import ListingsTable from "./ListingsTable";
import { JobListing } from "@/types";
import { useState, useEffect } from "react";

export default function DashboardClientWrapper({ jobs, role }: { jobs: JobListing[], role?: string }) {
  const [mounted, setMounted] = useState(false);
  const view = useDashboardStore(s => s.view);
  const showClosedJobs = useDashboardStore(s => s.showClosedJobs);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return skeleton or null to avoid hydration mismatch
    return null;
  }

  return (
    <ListingsTable 
      jobs={jobs} 
      view={view} 
      showClosedJobs={showClosedJobs} 
      role={role} 
    />
  );
}
