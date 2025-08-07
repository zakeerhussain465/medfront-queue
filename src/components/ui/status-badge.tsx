import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        waiting: "bg-waiting/10 text-waiting border border-waiting/20",
        "in-progress": "bg-warning/10 text-warning border border-warning/20",
        completed: "bg-success/10 text-success border border-success/20",
        urgent: "bg-urgent/10 text-urgent border border-urgent/20",
        booked: "bg-primary/10 text-primary border border-primary/20",
        cancelled: "bg-muted text-muted-foreground border border-border",
      },
    },
    defaultVariants: {
      variant: "waiting",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return (
    <div
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { StatusBadge, statusBadgeVariants };