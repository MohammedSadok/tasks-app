import * as z from "zod";

export const postRequestSchema = z.object({
  page: z.number().min(1),
  search: z.string().min(1).optional(),
});
