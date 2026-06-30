"use client";

import { useOptimistic, useState, useTransition } from "react";
import { closeJobListing } from "@/app/actions/closeJob";
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

interface Props {
  jobId: string;
  isActive: boolean;
}

export default function CloseJobButton({ jobId, isActive }: Props) {
  const [optimisticIsActive, setOptimisticIsActive] = useOptimistic(
    isActive,
    (state, newStatus: boolean) => newStatus
  );

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!optimisticIsActive) {
    return null;
  }

  const handleClose = () => {
    startTransition(async () => {
      setOptimisticIsActive(false);
      
      const formData = new FormData();
      formData.append("jobId", jobId);

      const result = await closeJobListing({ status: "idle" }, formData);
      
      if (result.status === "error") {
        toast.error(result.message || "Failed to close job listing");
        // We revert optimism by forcing a re-render or let the server state snap back
      } else {
        toast.success("Job listing closed successfully");
      }
      setOpen(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium disabled:opacity-50 ml-3"
        >
          Close
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently close the job listing 
            and prevent any future candidates from applying.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleClose();
            }} 
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? "Closing..." : "Close listing"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
