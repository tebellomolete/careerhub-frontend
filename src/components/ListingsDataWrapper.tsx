import { JobListing } from "@/types";
import DashboardClientWrapper from "./DashboardClientWrapper";
import { auth } from "@/auth";

interface AppStats {
  jobId: string;
  applicationCount: number;
}

export default async function ListingsDataWrapper() {
  const jobsResPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs`, {
    next: { tags: ["jobs"] },
  });
  
  const statsResPromise = fetch(`http://localhost:3000/api/applications/stats`, {
    cache: "no-store",
  });

  const [jobsRes, statsRes] = await Promise.all([jobsResPromise, statsResPromise]);

  if (!jobsRes.ok) throw new Error("Failed to fetch jobs");
  if (!statsRes.ok) throw new Error("Failed to fetch stats");

  const jobsData = await jobsRes.json();
  const statsData: AppStats[] = await statsRes.json();

  const jobs: JobListing[] = jobsData.data.map((job: any) => {
    let salaryMin = 0;
    let salaryMax = 0;
    if (job.salaryDisplay) {
      const parts = job.salaryDisplay.replace(/[^\d-]/g, "").split("-");
      if (parts.length >= 2) {
        salaryMin = parseInt(parts[0], 10) || 0;
        salaryMax = parseInt(parts[1], 10) || 0;
      }
    }

    const stat = statsData.find((s) => s.jobId === job.id);

    return {
      id: job.id,
      title: job.title,
      company: job.companyName,
      location: job.location,
      employmentType: job.type,
      salaryMin,
      salaryMax,
      postedAt: job.postedAt,
      isActive: job.isActive !== undefined ? job.isActive : true,
      applicantCount: stat ? stat.applicationCount : (job.applicationCount ?? 0),
    };
  });

  const session = await auth();

  return <DashboardClientWrapper jobs={jobs} role={session?.user?.role} />;
}
