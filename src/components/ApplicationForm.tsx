"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitApplication } from "@/lib/api";

const ApplicationFormData = z
  .object({
    applicantName: z.string().min(2, "Full name must be at least 2 characters").max(100),
    applicantEmail: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-()]{8,15}$/, "Please enter a valid phone number")
      .or(z.literal(""))
      .optional(),
    yearsOfExperience: z.coerce.number().int().min(0).max(50),
    coverLetter: z
      .string()
      .min(50, "Cover letter must be at least 50 characters - tell us why you're a strong fit")
      .max(2000),
    linkedInUrl: z
      .string()
      .url("Please enter a valid URL")
      .includes("linkedin.com", { message: "URL must be a LinkedIn profile" })
      .or(z.literal(""))
      .optional(),
    availableImmediately: z.boolean(),
    noticePeriodWeeks: z.coerce.number().int().min(0).optional(),
  })
  .refine(
    (data) => data.availableImmediately || (data.noticePeriodWeeks !== undefined && data.noticePeriodWeeks > 0),
    {
      message: "Notice period must be greater than 0 if not available immediately",
      path: ["noticePeriodWeeks"],
    }
  );

type FormData = z.infer<typeof ApplicationFormData>;

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

export default function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(ApplicationFormData) as any,
    defaultValues: {
      availableImmediately: true,
      noticePeriodWeeks: 0,
      yearsOfExperience: 0,
    },
  });

  const availableImmediately = watch("availableImmediately");

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      submitApplication({
        ...data,
        jobId,
      }),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["jobs"] });

      // Snapshot the previous value by iterating queries
      const previousQueries = queryClient.getQueriesData({ queryKey: ["jobs"] });

      // Optimistically update
      queryClient.setQueriesData({ queryKey: ["jobs"] }, (old: any) => {
        if (!old || !old.jobs) return old;
        return {
          ...old,
          jobs: old.jobs.map((job: any) =>
            job.id === jobId ? { ...job, hasApplied: true } : job
          ),
        };
      });

      return { previousQueries };
    },
    onError: (err, newApplication, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onSuccess: () => {
      reset();
    },
  });

  const isBusy = isSubmitting || mutation.isPending;

  const onSubmit = async (data: FormData) => {
    await mutation.mutateAsync(data);
  };

  if (mutation.isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg shadow-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
        <h3 className="text-lg font-bold mb-2">Application Submitted!</h3>
        <p>Thank you for applying for the {jobTitle} role. We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Apply for {jobTitle}</h3>
      
      {mutation.isError && (
        <div className="mb-6 p-4 rounded-md border border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          <p className="font-semibold">Failed to submit application</p>
          <p className="text-sm mt-1">{mutation.error?.message || "An unknown error occurred"}</p>
        </div>
      )}

      {/* noValidate prevents the browser's default HTML5 popup validation from clashing with Zod */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
          <input
            type="text"
            {...register("applicantName")}
            aria-invalid={!!errors.applicantName}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border bg-transparent ${
              errors.applicantName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 dark:border-gray-700"
            } dark:text-gray-100`}
          />
          {errors.applicantName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.applicantName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
          <input
            type="email"
            {...register("applicantEmail")}
            aria-invalid={!!errors.applicantEmail}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border bg-transparent ${
              errors.applicantEmail ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 dark:border-gray-700"
            } dark:text-gray-100`}
          />
          {errors.applicantEmail && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.applicantEmail.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone (Optional)</label>
          <input
            type="tel"
            {...register("phone")}
            aria-invalid={!!errors.phone}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border bg-transparent ${
              errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 dark:border-gray-700"
            } dark:text-gray-100`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Years of Experience *</label>
          <input
            type="number"
            {...register("yearsOfExperience")}
            aria-invalid={!!errors.yearsOfExperience}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border bg-transparent ${
              errors.yearsOfExperience ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 dark:border-gray-700"
            } dark:text-gray-100`}
          />
          {errors.yearsOfExperience && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.yearsOfExperience.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Letter *</label>
          <textarea
            rows={4}
            {...register("coverLetter")}
            aria-invalid={!!errors.coverLetter}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border bg-transparent ${
              errors.coverLetter ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 dark:border-gray-700"
            } dark:text-gray-100`}
          />
          {errors.coverLetter && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.coverLetter.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn URL (Optional)</label>
          <input
            type="url"
            {...register("linkedInUrl")}
            aria-invalid={!!errors.linkedInUrl}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border bg-transparent ${
              errors.linkedInUrl ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 dark:border-gray-700"
            } dark:text-gray-100`}
          />
          {errors.linkedInUrl && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.linkedInUrl.message}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="availableImmediately"
            {...register("availableImmediately")}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="availableImmediately" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
            Available Immediately
          </label>
        </div>

        {!availableImmediately && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notice Period (Weeks) *</label>
            <input
              type="number"
              {...register("noticePeriodWeeks")}
              aria-invalid={!!errors.noticePeriodWeeks}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border bg-transparent ${
                errors.noticePeriodWeeks ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 dark:border-gray-700"
              } dark:text-gray-100`}
            />
            {errors.noticePeriodWeeks && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.noticePeriodWeeks.message}</p>}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isBusy}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBusy ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
