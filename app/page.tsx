import { PostCreateButton } from "@/components/CreatTaskButton";
import { DashboardHeader } from "@/components/Header";
// import { TaskItem } from "@/components/TaskItem";
import { TaskItem } from "@/components/TaskItem";
import { db } from "@/lib/db";
import { FileText } from "lucide-react";
export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const tasks = await db.task.findMany({
    select: {
      id: true,
      title: true,
      text: true,
      createdAt: true,
      isCompleted: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return (
    <div className="grid items-start gap-8">
      <DashboardHeader heading="Tasks" text="Create and manage tasks.">
        <PostCreateButton />
      </DashboardHeader>
      <div>
        {tasks?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <>
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-10 w-10" />
                </div>
                <h2 className="mt-6 text-xl font-semibold">No tasks created</h2>
                <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
                  You don&apos;t have any tasks yet. Start creating content.
                </p>
                <PostCreateButton variant="outline" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
