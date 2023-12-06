import * as z from "zod";

export const postPatchSchema = z.object({
  title: z.string().min(3).max(128).optional(),
  imageUrl: z.union([z.string(), z.null()]).optional(),
  // TODO: Type this properly from editorjs block types?
  content: z.any().optional(),
});
