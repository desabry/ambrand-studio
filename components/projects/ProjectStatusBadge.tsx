import { cn } from "@/lib/cn";

interface Props {
  status: string;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: Props) {
  const styles: Record<string, string> = {
    Published: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Draft: "bg-surface-50 text-surface-600 border-surface-200",
    Archived: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
      styles[status] || styles.Draft,
      className
    )}>
      {status}
    </span>
  );
}
