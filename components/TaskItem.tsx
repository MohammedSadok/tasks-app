import { Task } from "@prisma/client";
import Link from "next/link";

import { PostOperations } from "@/components/post-operations";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

interface TaskItemProps {
  task: Pick<Task, "id" | "title" | "createdAt" | "isCompleted">;
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${task.id}`}
          className="font-semibold hover:underline"
        >
          {task.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(task.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      <PostOperations taskId={task.id} />
    </div>
  );
}

TaskItem.Skeleton = function TaskItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};
