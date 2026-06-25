"use server";

import { revalidateTag } from "next/cache";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  jobTitle?: string;
};

export async function closeJobListing(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const jobId = formData.get("jobId") as string;
  
  if (!jobId) {
    return { status: "error", message: "Job ID is required" };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${jobId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Closed" }),
    });

    if (!res.ok) {
      return { status: "error", message: `Failed to close job: ${res.statusText}` };
    }

    const job = await res.json();
    
    revalidateTag("jobs");
    revalidateTag(`job-${jobId}`);

    return { status: "success", jobTitle: job.title || "Job" };
  } catch (err: any) {
    return { status: "error", message: err.message || "An unexpected error occurred" };
  }
}
