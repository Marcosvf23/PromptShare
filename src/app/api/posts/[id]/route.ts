import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }

    // Formatar resposta
    const formattedPost = {
      ...post,
      author: post.user,
      tags: post.tags.map((pt: any) => pt.tag),
      comments: post.comments.map((c: any) => ({
        ...c,
        author: c.user,
      })),
      likes: post._count.likes,
      commentsCount: post._count.comments,
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Erro ao buscar post" }, { status: 500 });
  }
}
