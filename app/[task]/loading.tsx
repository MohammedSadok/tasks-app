import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="grid items-start gap-8">
      <div className="divide-border-200 divide-y rounded-md border">
        <div className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
