import { getServerSession } from "next-auth/next";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { RequiresProPlanError } from "@/lib/exceptions";

const taskCreateSchema = z.object({
  title: z.string(),
  text: z.string(),
});

export async function GET(req: Request) {
  // const { searchParams } = new URL(req.url);
  // const pageParam = searchParams.get("page");
  // const searchParam = searchParams.get("search");
  // const page = pageParam !== null ? parseInt(pageParam) : 1;
  // const search = searchParam !== null ? searchParam : "";

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    // const posts = await db.post.findMany({
    //   take: 2,
    //   skip: (page - 1) * 2,
    //   select: {
    //     id: true,
    //     title: true,
    //     published: true,
    //     createdAt: true,
    //     imageUrl: true,
    //   },
    //   where: {
    //     title: {
    //       contains: search,
    //     },
    //     authorId: user.id,
    //   },
    // });
    const tasks = await db.task.findMany({
      select: {
        id: true,
        title: true,
        text: true,
        isCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new Response(JSON.stringify(tasks));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = taskCreateSchema.parse(json);

    const task = await db.task.create({
      data: {
        title: body.title,
        text: body.text,
        authorId: session.user.id,
      },
      select: {
        id: true,
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
