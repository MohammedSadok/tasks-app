import * as z from "zod";

export const taskPatchSchema = z.object({
  title: z.string(),
  text: z.string(),
  isCompleted: z.boolean().optional(),
});
