import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Buscar posts do usuário
    const posts = await prisma.post.findMany({
      where: {
        userId: user.id,
        published: true,
      },
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
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Formatar resposta
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      prompt: post.prompt,
      imageUrl: post.imageUrl,
      thumbnailUrl: post.thumbnailUrl,
      model: post.model,
      author: {
        id: post.user.id,
        username: post.user.username,
        name: post.user.name,
        avatarUrl: post.user.avatarUrl,
      },
      tags: post.tags.map((pt) => pt.tag.name),
      likes: post._count.likes,
      comments: post._count.comments,
      createdAt: post.createdAt,
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar posts do usuário" },
      { status: 500 }
    );
  }
}
