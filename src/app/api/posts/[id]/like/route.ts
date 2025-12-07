import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await request.json();
    const params = await context.params;
    const postId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o post existe
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário já deu like
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Remover like (unlike)
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      // Atualizar contador no post
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      return NextResponse.json({
        liked: false,
        likeCount: updatedPost._count.likes,
      });
    } else {
      // Adicionar like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });

      // Atualizar contador no post
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      return NextResponse.json({
        liked: true,
        likeCount: updatedPost._count.likes,
      });
    }
  } catch (error) {
    console.error("Erro ao processar like:", error);
    return NextResponse.json(
      { error: "Falha ao processar like" },
      { status: 500 }
    );
  }
}

// GET - Verificar se usuário deu like no post
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const params = await context.params;
    const postId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return NextResponse.json({
      liked: !!like,
      likeCount: post?._count.likes || 0,
    });
  } catch (error) {
    console.error("Erro ao buscar like:", error);
    return NextResponse.json(
      { error: "Falha ao buscar like" },
      { status: 500 }
    );
  }
}
