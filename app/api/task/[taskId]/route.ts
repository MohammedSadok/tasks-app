import { getServerSession } from "next-auth";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { taskPatchSchema } from "@/lib/validations/task";

const routeContextSchema = z.object({
  params: z.object({
    taskId: z.string(),
  }),
});

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context);

    // Check if the user has access to this task.
    if (!(await verifyCurrentUserHasAccessTotask(params.taskId))) {
      return new Response(null, { status: 403 });
    }

    // Delete the task.
    await db.task.delete({
      where: {
        id: params.taskId as string,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context);

    // Check if the user has access to this task.
    if (!(await verifyCurrentUserHasAccessTotask(params.taskId))) {
      return new Response(null, { status: 403 });
    }

    // Get the request body and validate it.
    const json = await req.json();
    const body = taskPatchSchema.parse(json);

    // Update the task.
    // TODO: Implement sanitization for content.
    await db.task.update({
      where: {
        id: params.taskId,
      },
      data: {
        title: body.title,
        text: body.text,
        isCompleted: body.isCompleted,
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context);

    // Get the request body and validate it.
    const json = await req.json();
    const body = taskPatchSchema.parse(json);

    // Update the task.

    const task = await db.task.findFirst({
      select: {
        id: true,
        title: true,
        text: true,
        isCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        id: params.taskId,
      },
    });

    return new Response(JSON.stringify(task));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
async function verifyCurrentUserHasAccessTotask(taskId: string) {
  const session = await getServerSession(authOptions);
  const count = await db.task.count({
    where: {
      id: taskId,
      authorId: session?.user.id,
    },
  });

  return count > 0;
}
