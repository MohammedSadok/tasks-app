// import { getServerSession } from "next-auth/next";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { RequiresProPlanError } from "@/lib/exceptions";
import { postRequestSchema } from "@/lib/validations/request";

const postCreateSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  imageUrl: z.string().min(1).optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const page = pageParam !== null ? parseInt(pageParam) : 1;
  const search = searchParam !== null ? searchParam : "";

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const posts = await db.post.findMany({
      take: 2,
      skip: (page - 1) * 2,
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
        imageUrl: true,
      },
      where: {
        title: {
          contains: search,
        },
        authorId: user.id,
      },
    });

    return new Response(JSON.stringify(posts));
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
    const body = postCreateSchema.parse(json);

    const post = await db.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: session.user.id,
        imageUrl: body.imageUrl,
      },
      select: {
        id: true,
      },
    });

    return new Response(JSON.stringify(post));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    if (error instanceof RequiresProPlanError) {
      return new Response("Requires Pro Plan", { status: 402 });
    }

    return new Response(null, { status: 500 });
  }
}
