"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitApplication } from "@/lib/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

const WizardSchema = z.object({
  applicantName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  applicantEmail: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  coverLetter: z.string().optional(),
  linkedInUrl: z.string().optional(),
  howDidYouHear: z.string().min(1, "Please select an option"),
}).refine((data) => {
  if (data.linkedInUrl && data.linkedInUrl.trim() !== "") {
    const url = data.linkedInUrl.trim();
    return url.startsWith("https://linkedin.com/") || url.startsWith("https://www.linkedin.com/");
  }
  return true;
}, {
  message: "URL must start with https://linkedin.com/ or https://www.linkedin.com/",
  path: ["linkedInUrl"],
});

type FormData = z.infer<typeof WizardSchema>;

interface ApplicationWizardProps {
  jobId: string;
  jobTitle: string;
  role?: string;
}

export default function ApplicationWizard({ jobId, jobTitle, role }: ApplicationWizardProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [hasDraft, setHasDraft] = useState(false);
  const [mounted, setMounted] = useState(false);

  const storageKey = `careerhub-application-${jobId}`;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(WizardSchema),
    defaultValues: {
      applicantName: "",
      applicantEmail: "",
      phone: "",
      coverLetter: "",
      linkedInUrl: "",
      howDidYouHear: "",
    },
  });

  useEffect(() => {
    setMounted(true);
    const draft = localStorage.getItem(storageKey);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        reset(parsed);
        setHasDraft(true);
      } catch (e) {
        // invalid JSON
      }
    }
  }, [storageKey, reset]);

  useEffect(() => {
    if (!mounted) return;
    const subscription = watch((value) => {
      localStorage.setItem(storageKey, JSON.stringify(value));
      setHasDraft(true);
    });
    return () => subscription.unsubscribe();
  }, [watch, storageKey, mounted]);

  // Stretch A: Cross-tab sync
  useEffect(() => {
    if (!mounted) return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            reset(parsed);
            setHasDraft(true);
          } catch (e) {}
        } else {
          reset({
            applicantName: "",
            applicantEmail: "",
            phone: "",
            coverLetter: "",
            linkedInUrl: "",
            howDidYouHear: "",
          });
          setHasDraft(false);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey, mounted, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => submitApplication({ ...data, jobId }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["jobs"] });
      const previousQueries = queryClient.getQueriesData({ queryKey: ["jobs"] });
      queryClient.setQueriesData({ queryKey: ["jobs"] }, (old: any) => {
        if (!old || !old.jobs) return old;
        return {
          ...old,
          jobs: old.jobs.map((job: any) => job.id === jobId ? { ...job, hasApplied: true } : job),
        };
      });
      return { previousQueries };
    },
    onError: (err, newApp, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err.message || "Failed to submit application");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onSuccess: () => {
      localStorage.removeItem(storageKey);
      setHasDraft(false);
      reset({
        applicantName: "",
        applicantEmail: "",
        phone: "",
        coverLetter: "",
        linkedInUrl: "",
        howDidYouHear: "",
      });
      setStep(1);
      toast.success("Application Submitted!");
    },
  });

  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger(["applicantName", "applicantEmail", "phone"]);
      if (valid) {
        setStep(2);
      }
    } else if (step === 2) {
      const valid = await trigger(["coverLetter", "linkedInUrl", "howDidYouHear"]);
      if (valid) {
        setStep(3);
      }
    }
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  const discardDraft = () => {
    localStorage.removeItem(storageKey);
    reset({
      applicantName: "",
      applicantEmail: "",
      phone: "",
      coverLetter: "",
      linkedInUrl: "",
      howDidYouHear: "",
    });
    setHasDraft(false);
    setStep(1);
  };

  const isBusy = isSubmitting || mutation.isPending;
  const onSubmit = async (data: FormData) => {
    await mutation.mutateAsync(data);
  };

  if (!mounted) return null; // Wait for client hydration

  // Stretch C: LinkedIn Preview
  const linkedInVal = watch("linkedInUrl");
  let linkedinSlug = "";
  if (linkedInVal && (linkedInVal.startsWith("https://linkedin.com/in/") || linkedInVal.startsWith("https://www.linkedin.com/in/"))) {
    const parts = linkedInVal.split("/in/");
    if (parts.length > 1) {
      linkedinSlug = parts[1].replace(/\/$/, "");
    }
  }

  const getStepStyle = (stepNumber: number) => ({
    transform: `translateX(${(stepNumber - step) * 100}%)`,
    opacity: step === stepNumber ? 1 : 0,
    pointerEvents: step === stepNumber ? 'auto' : 'none' as any,
    transition: "transform 0.4s ease-in-out, opacity 0.4s ease-in-out",
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Apply for {jobTitle}</h3>
        {hasDraft && (
          <AlertDialog>
            <AlertDialogTrigger className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
              Discard draft
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard Draft?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your saved progress for this application.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={discardDraft} className="bg-red-600 hover:bg-red-700 text-white">
                  Discard
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {hasDraft && step === 1 && (
        <div className="mb-6 p-4 rounded-md border border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
          You have a saved draft for this application. Restored automatically.
        </div>
      )}

      {step === 1 && role !== "candidate" && (
        <div className="mb-6 p-4 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300">
          You need to be signed in as a candidate to apply. <Link href="/login" className="underline font-medium">Sign in here</Link>.
        </div>
      )}

      <div className="relative overflow-hidden w-full h-[380px]">
        {/* Step 1: Your Details */}
        <div className="absolute inset-0 flex flex-col justify-between" style={getStepStyle(1)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
              <input type="text" {...register("applicantName")} className="mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border border-gray-300 dark:border-gray-700 bg-transparent dark:text-gray-100" />
              {errors.applicantName && <p className="mt-1 text-sm text-red-600">{errors.applicantName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
              <input type="email" {...register("applicantEmail")} className="mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border border-gray-300 dark:border-gray-700 bg-transparent dark:text-gray-100" />
              {errors.applicantEmail && <p className="mt-1 text-sm text-red-600">{errors.applicantEmail.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone (Optional)</label>
              <input type="tel" {...register("phone")} className="mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border border-gray-300 dark:border-gray-700 bg-transparent dark:text-gray-100" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
             <button type="button" onClick={nextStep} disabled={role !== "candidate"} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
               Next
             </button>
          </div>
        </div>

        {/* Step 2: Your Application */}
        <div className="absolute inset-0 flex flex-col justify-between" style={getStepStyle(2)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Letter (Optional)</label>
              <textarea rows={3} {...register("coverLetter")} className="mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border border-gray-300 dark:border-gray-700 bg-transparent dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn URL (Optional)</label>
              <input type="url" {...register("linkedInUrl")} className="mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border border-gray-300 dark:border-gray-700 bg-transparent dark:text-gray-100" />
              {errors.linkedInUrl && <p className="mt-1 text-sm text-red-600">{errors.linkedInUrl.message}</p>}
              
              {/* Stretch C: LinkedIn Preview */}
              {linkedinSlug && (
                <div className="mt-2 flex items-center space-x-3 p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                   <img src={`https://avatar.vercel.sh/${linkedinSlug}`} alt="LinkedIn Preview" className="w-8 h-8 rounded-full" onError={(e) => (e.currentTarget.style.display = 'none')} />
                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">@{linkedinSlug}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">How did you hear about this role? *</label>
              <select {...register("howDidYouHear")} className="mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border border-gray-300 dark:border-gray-700 bg-transparent dark:text-gray-100">
                <option value="">Select an option</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Google">Google</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
              {errors.howDidYouHear && <p className="mt-1 text-sm text-red-600">{errors.howDidYouHear.message}</p>}
            </div>
          </div>
          <div className="mt-6 flex justify-between">
             <button type="button" onClick={prevStep} className="py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
               Back
             </button>
             <button type="button" onClick={nextStep} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
               Next
             </button>
          </div>
        </div>

        {/* Step 3: Review */}
        <div className="absolute inset-0 flex flex-col justify-between" style={getStepStyle(3)}>
          <div className="space-y-4">
            <h4 className="font-bold text-lg dark:text-gray-100">Review Your Details</h4>
            <div className="space-y-2 text-sm dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <p><strong>Name:</strong> {getValues("applicantName")}</p>
              <p><strong>Email:</strong> {getValues("applicantEmail")}</p>
              <p><strong>Phone:</strong> {getValues("phone") || "Not provided"}</p>
              <p><strong>Cover Letter:</strong> {getValues("coverLetter") || "Not provided"}</p>
              <p><strong>LinkedIn URL:</strong> {getValues("linkedInUrl") || "Not provided"}</p>
              <p><strong>Heard About Role:</strong> {getValues("howDidYouHear")}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
             <button type="button" onClick={prevStep} className="py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
               Back
             </button>
             <button type="button" onClick={handleSubmit(onSubmit)} disabled={isBusy} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
               {isBusy ? "Submitting..." : "Submit Application"}
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
