import { TaskItem } from "@/components/TaskItem";
import { DashboardHeader } from "@/components/header";
import { PostCreateButton } from "@/components/post-create-button";

export default function DashboardLoading() {
  return (
    <div className="grid items-start gap-8">
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <TaskItem.Skeleton />
      </div>
    </div>
  );
}
