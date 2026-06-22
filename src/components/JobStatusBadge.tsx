import { Badge } from "@/components/ui/badge";
import { EmploymentType } from "@/types";
import { cn } from "@/lib/utils";

interface JobStatusBadgeProps {
  employmentType: EmploymentType;
  isActive: boolean;
  className?: string;
}

const badgeStyles: Record<EmploymentType, string> = {
  FullTime: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900",
  PartTime: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900",
  Contract: "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-200 dark:hover:bg-orange-900",
  Internship: "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:hover:bg-purple-900",
};

export default function JobStatusBadge({ employmentType, isActive, className }: JobStatusBadgeProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Badge className={cn("border-transparent", badgeStyles[employmentType])}>
        {employmentType}
      </Badge>
      {!isActive && (
        <Badge variant="destructive">
          Expired
        </Badge>
      )}
    </div>
  );
}
