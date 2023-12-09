import * as z from "zod";

export const taskPatchSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  text: z.string().optional(),
  isCompleted: z.boolean().optional(),
});
export const taskGetSchema = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string(),
  isCompleted: z.boolean(),
  updatedAt: z.string(),
});

export const taskCreateSchema = z.object({
  title: z.string(),
  text: z.string(),
});

export const routeContextSchema = z.object({
  params: z.object({
    taskId: z.string(),
  }),
});

export const formSchema = z.object({
  title: z.string().min(5, {
    message: "Task title is required.",
  }),
  text: z.string().min(5, { message: "Task title is required" }),
});
