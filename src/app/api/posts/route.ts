import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
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

    // Transform the data to match the frontend format
    const transformedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      imageUrl: post.imageUrl,
      thumbnailUrl: post.thumbnailUrl,
      prompt: post.prompt,
      model: post.model,
      negativePrompt: post.negativePrompt,
      steps: post.steps,
      cfgScale: post.cfgScale,
      sampler: post.sampler,
      seed: post.seed,
      width: post.width,
      height: post.height,
      author: {
        id: post.user.id,
        username: post.user.username || "anonymous",
        name: post.user.name || post.user.username || "Anonymous User",
        avatarUrl: post.user.avatarUrl || "",
      },
      tags: post.tags.map((pt: { tag: { name: string; slug: string } }) => ({
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
      likes: post._count.likes,
      comments: post._count.comments,
      createdAt: post.createdAt.toISOString(),
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
