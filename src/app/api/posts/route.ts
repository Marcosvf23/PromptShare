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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      prompt,
      imageUrl,
      thumbnailUrl,
      model,
      negativePrompt,
      steps,
      cfgScale,
      sampler,
      seed,
      width,
      height,
      tags,
      userId,
    } = body;

    // Validações
    if (!title || !prompt || !imageUrl || !userId) {
      return NextResponse.json(
        { error: "Campos obrigatórios: title, prompt, imageUrl, userId" },
        { status: 400 }
      );
    }

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Criar post
    const post = await prisma.post.create({
      data: {
        title,
        prompt,
        imageUrl,
        thumbnailUrl: thumbnailUrl || imageUrl,
        model,
        negativePrompt,
        steps: steps ? parseInt(steps) : null,
        cfgScale: cfgScale ? parseFloat(cfgScale) : null,
        sampler,
        seed,
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        userId,
        published: true,
      },
    });

    // Se houver tags, criar relacionamentos
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        const slug = tagName.toLowerCase().replace(/\s+/g, "-");

        // Buscar ou criar tag
        let tag = await prisma.tag.findUnique({
          where: { slug },
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              slug,
            },
          });
        }

        // Criar relacionamento PostTag
        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        });

        // Incrementar contador de posts da tag
        await prisma.tag.update({
          where: { id: tag.id },
          data: { postCount: { increment: 1 } },
        });
      }
    }

    // Buscar post completo com tags
    const completePost = await prisma.post.findUnique({
      where: { id: post.id },
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
    });

    // Transformar para formato do frontend
    const response = {
      id: completePost!.id,
      title: completePost!.title,
      imageUrl: completePost!.imageUrl,
      thumbnailUrl: completePost!.thumbnailUrl,
      prompt: completePost!.prompt,
      model: completePost!.model,
      negativePrompt: completePost!.negativePrompt,
      steps: completePost!.steps,
      cfgScale: completePost!.cfgScale,
      sampler: completePost!.sampler,
      seed: completePost!.seed,
      width: completePost!.width,
      height: completePost!.height,
      author: {
        id: completePost!.user.id,
        username: completePost!.user.username || "anonymous",
        name: completePost!.user.name || "Anonymous User",
        avatarUrl: completePost!.user.avatarUrl || "",
      },
      tags: completePost!.tags.map(
        (pt: { tag: { name: string; slug: string } }) => ({
          name: pt.tag.name,
          slug: pt.tag.slug,
        })
      ),
      likes: completePost!._count.likes,
      comments: completePost!._count.comments,
      createdAt: completePost!.createdAt.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return NextResponse.json({ error: "Falha ao criar post" }, { status: 500 });
  }
}
