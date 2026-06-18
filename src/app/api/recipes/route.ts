import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/option";

export async function GET() {
  try {
    const recipes = await prisma.recipes.findMany({
      include: {
        author: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(options);
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, image } = body;

    const recipe = await prisma.recipes.create({
      data: {
        title,
        content,
        image,
        author_id: parseInt((session.user as any).id),
      },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 });
  }
}
