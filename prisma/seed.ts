import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;
let prisma: PrismaClient;

const users = [
  {
    email: "joao@example.com",
    username: "joao_silva",
    name: "João Silva",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
    bio: "Entusiasta de IA e arte digital",
  },
  {
    email: "maria@example.com",
    username: "maria_costa",
    name: "Maria Costa",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    bio: "Designer e criadora de conteúdo",
  },
  {
    email: "pedro@example.com",
    username: "pedro_santos",
    name: "Pedro Santos",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
    bio: "Fotógrafo e amante da natureza",
  },
];

const tags = [
  { name: "Cyberpunk", slug: "cyberpunk" },
  { name: "Fantasia", slug: "fantasia" },
  { name: "Natureza", slug: "natureza" },
  { name: "Paisagem", slug: "paisagem" },
  { name: "Retrato", slug: "retrato" },
  { name: "Abstrato", slug: "abstrato" },
  { name: "Futurista", slug: "futurista" },
  { name: "Realista", slug: "realista" },
  { name: "Anime", slug: "anime" },
  { name: "Cidade", slug: "cidade" },
];

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Initialize Prisma Client with Pool adapter
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    max: 1, // Use only 1 connection for seeding
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });

  // Limpar dados existentes
  console.log("🗑️  Limpando dados existentes...");
  await prisma.collectionPost.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  console.log("👤 Criando usuários...");
  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: user,
      })
    )
  );
  console.log(`✅ ${createdUsers.length} usuários criados`);

  // Criar tags
  console.log("🏷️  Criando tags...");
  const createdTags = await Promise.all(
    tags.map((tag) =>
      prisma.tag.create({
        data: tag,
      })
    )
  );
  console.log(`✅ ${createdTags.length} tags criadas`);

  // Criar posts
  console.log("📝 Criando posts...");
  const posts = [
    {
      title: "Paisagem Cyberpunk Futurista",
      prompt:
        "A futuristic cyberpunk cityscape at night, neon lights reflecting on wet streets, flying cars, towering skyscrapers, detailed, 8k, photorealistic",
      imageUrl:
        "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&auto=format&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&auto=format&fit=crop",
      width: 1024,
      height: 1024,
      model: "Stable Diffusion XL",
      steps: 30,
      cfgScale: 7.5,
      sampler: "DPM++ 2M Karras",
      userId: createdUsers[0].id,
      published: true,
      featured: true,
      tagNames: ["cyberpunk", "futurista", "cidade"],
    },
    {
      title: "Retrato Artístico de Fantasia",
      prompt:
        "Portrait of a mystical elven warrior, long flowing hair, intricate armor with glowing runes, fantasy art style, highly detailed, dramatic lighting",
      imageUrl:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&auto=format&fit=crop",
      width: 768,
      height: 1024,
      model: "Midjourney v6",
      userId: createdUsers[1].id,
      published: true,
      tagNames: ["fantasia", "retrato"],
    },
    {
      title: "Paisagem Natural Serena",
      prompt:
        "Beautiful mountain landscape at sunrise, misty valleys, golden hour lighting, peaceful lake reflection, ultra realistic, cinematic composition",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop",
      width: 1920,
      height: 1080,
      model: "DALL-E 3",
      userId: createdUsers[2].id,
      published: true,
      featured: true,
      tagNames: ["natureza", "paisagem", "realista"],
    },
  ];

  for (const postData of posts) {
    const { tagNames, ...postFields } = postData;

    const post = await prisma.post.create({
      data: {
        ...postFields,
        tags: {
          create: tagNames.map((tagName) => ({
            tag: {
              connect: {
                slug: tagName,
              },
            },
          })),
        },
      },
    });

    // Atualizar contagem de posts nas tags
    await Promise.all(
      tagNames.map((tagName) =>
        prisma.tag.update({
          where: { slug: tagName },
          data: { postCount: { increment: 1 } },
        })
      )
    );

    console.log(`✅ Post criado: ${post.title}`);
  }

  // Criar alguns likes
  console.log("❤️  Criando likes...");
  const allPosts = await prisma.post.findMany();

  for (const post of allPosts) {
    // Cada post recebe likes de 1-2 usuários aleatórios
    const likesCount = Math.floor(Math.random() * 2) + 1;
    const usersToLike = createdUsers.slice(0, likesCount);

    for (const user of usersToLike) {
      await prisma.like.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      });
    }

    // Atualizar contador de likes
    await prisma.post.update({
      where: { id: post.id },
      data: { likeCount: likesCount },
    });
  }

  // Criar alguns comentários
  console.log("💬 Criando comentários...");
  const firstPost = allPosts[0];

  const comment = await prisma.comment.create({
    data: {
      content: "Incrível! Adorei as cores e a atmosfera cyberpunk!",
      userId: createdUsers[1].id,
      postId: firstPost.id,
    },
  });

  // Criar uma resposta ao comentário
  await prisma.comment.create({
    data: {
      content: "Obrigado! Demorei bastante para acertar o prompt.",
      userId: createdUsers[0].id,
      postId: firstPost.id,
      parentId: comment.id,
    },
  });

  // Atualizar contador de comentários
  await prisma.post.update({
    where: { id: firstPost.id },
    data: { commentCount: 2 },
  });

  // Criar sistema de follows
  console.log("👥 Criando seguidores...");
  await prisma.follows.create({
    data: {
      followerId: createdUsers[1].id,
      followingId: createdUsers[0].id,
    },
  });

  await prisma.follows.create({
    data: {
      followerId: createdUsers[2].id,
      followingId: createdUsers[0].id,
    },
  });

  console.log("✅ Seed concluído com sucesso!");
  console.log("\n📊 Resumo:");
  console.log(`   👤 ${createdUsers.length} usuários`);
  console.log(`   📝 ${allPosts.length} posts`);
  console.log(`   🏷️  ${createdTags.length} tags`);
  console.log(`   ❤️  Likes adicionados`);
  console.log(`   💬 Comentários adicionados`);
  console.log(`   👥 Relações de seguir criadas`);
  console.log("\n🚀 Você pode visualizar os dados em: http://localhost:5555");
  console.log("   Execute: npx prisma studio");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
