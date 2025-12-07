import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/feed - Feed personalizado com posts de quem você segue
export async function GET() {
  try {
    const session = await auth();

    // Se não estiver logado, retorna posts populares
    if (!session?.user?.id) {
      const posts = await prisma.post.findMany({
        take: 20,
        orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
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
              tag: true,
            },
          },
          likes: true,
          comments: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      return NextResponse.json({ posts, type: "popular" });
    }

    // Busca os IDs dos usuários que você segue
    const following = await prisma.follows.findMany({
      where: {
        followerId: session.user.id,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map(
      (f: { followingId: string }) => f.followingId
    );

    // Se não segue ninguém, retorna posts populares
    if (followingIds.length === 0) {
      const posts = await prisma.post.findMany({
        take: 20,
        orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
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
              tag: true,
            },
          },
          likes: true,
          comments: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      return NextResponse.json({
        posts,
        type: "popular",
        message: "Você ainda não segue ninguém",
      });
    }

    // Busca posts de quem você segue
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: followingIds,
        },
      },
      take: 50,
      orderBy: {
        createdAt: "desc",
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
            tag: true,
          },
        },
        likes: true,
        comments: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({
      posts,
      type: "following",
      followingCount: followingIds.length,
    });
  } catch (error) {
    console.error("Erro ao buscar feed:", error);
    return NextResponse.json({ error: "Erro ao buscar feed" }, { status: 500 });
  }
}
