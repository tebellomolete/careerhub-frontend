"use client";

import { useActionState, useOptimistic } from "react";
import { closeJobListing, ActionState } from "@/app/actions/closeJob";

interface Props {
  jobId: string;
  isActive: boolean;
}

export default function CloseJobButton({ jobId, isActive }: Props) {
  const [optimisticIsActive, setOptimisticIsActive] = useOptimistic(
    isActive,
    (state, newStatus: boolean) => newStatus
  );

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    closeJobListing,
    { status: "idle" }
  );

  if (!optimisticIsActive) {
    return null;
  }

  return (
    <form
      action={(formData) => {
        setOptimisticIsActive(false);
        formAction(formData);
      }}
      className="inline"
    >
      <input type="hidden" name="jobId" value={jobId} />
      <button
        type="submit"
        disabled={isPending}
        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium disabled:opacity-50 ml-3"
      >
        Close
      </button>
      {state.status === "error" && (
        <span className="text-xs text-red-500 block mt-1">{state.message}</span>
      )}
    </form>
  );
}
