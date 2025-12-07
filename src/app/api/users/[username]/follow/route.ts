import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { username } = await context.params;

    // Buscar usuário a ser seguido
    const userToFollow = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!userToFollow) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Não pode seguir a si mesmo
    if (userToFollow.id === session.user.id) {
      return NextResponse.json(
        { error: "Você não pode seguir a si mesmo" },
        { status: 400 }
      );
    }

    // Verificar se já segue
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userToFollow.id,
        },
      },
    });

    if (existingFollow) {
      // Deixar de seguir
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: userToFollow.id,
          },
        },
      });

      return NextResponse.json({
        success: true,
        following: false,
        message: "Você deixou de seguir este usuário",
      });
    } else {
      // Seguir
      await prisma.follows.create({
        data: {
          followerId: session.user.id,
          followingId: userToFollow.id,
        },
      });

      return NextResponse.json({
        success: true,
        following: true,
        message: "Você agora está seguindo este usuário",
      });
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ following: false });
    }

    const { username } = await context.params;

    // Buscar usuário
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

    // Verificar se está seguindo
    const isFollowing = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: user.id,
        },
      },
    });

    return NextResponse.json({
      following: !!isFollowing,
      isOwnProfile: user.id === session.user.id,
    });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json(
      { error: "Erro ao verificar status" },
      { status: 500 }
    );
  }
}
