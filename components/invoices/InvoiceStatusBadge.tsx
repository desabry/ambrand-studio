import { cn } from "@/lib/cn";
import { PaymentStatus } from "@/types/invoice";

interface Props {
  status: PaymentStatus;
  className?: string;
}

export function InvoiceStatusBadge({ status, className }: Props) {
  const styles = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
    unpaid: "bg-rose-50 text-rose-700 border-rose-100",
    partial: "bg-amber-50 text-amber-700 border-amber-100",
    overdue: "bg-red-50 text-red-700 border-red-100",
    cancelled: "bg-surface-50 text-surface-600 border-surface-200",
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
      styles[status] || styles.unpaid,
      className
    )}>
      {status}
    </span>
  );
}
