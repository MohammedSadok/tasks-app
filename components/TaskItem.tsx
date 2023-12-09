"use client";
import { cn, formatDate } from "@/lib/utils";
import { Task } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { TaskOperations } from "./TaskOperations";
import { Checkbox } from "./ui/checkbox";
interface TaskItemProps {
  task: Pick<Task, "id" | "title" | "createdAt" | "isCompleted">;
}

export function TaskItem({ task }: TaskItemProps) {
  const [completed, setIsCompleted] = useState<boolean>(task.isCompleted);
  const handleChange = async () => {
    try {
      await fetch(`/api/task/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCompleted: !task.isCompleted }),
      });
      setIsCompleted(!completed);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center justify-between gap-6">
        <Checkbox
          className="w-5 h-5"
          onCheckedChange={handleChange}
          checked={completed}
        />

        <div className="grid gap-1">
          <Link
            href={`/${task.id}`}
            className={cn(
              "font-semibold hover:underline",
              completed && "line-through"
            )}
          >
            {task.title}
          </Link>
          <div>
            <p className="text-sm text-muted-foreground">
              {formatDate(task.createdAt?.toDateString())}
            </p>
          </div>
        </div>
      </div>
      <TaskOperations taskId={task.id} />
    </div>
  );
}
