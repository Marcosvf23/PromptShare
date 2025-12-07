# 🔄 Próximas Etapas - Integração com Banco de Dados

## 📋 Checklist de Implementação

### 1. ✅ Configuração Inicial (Concluído)

- [x] Schema Prisma criado e otimizado
- [x] Tipos TypeScript definidos
- [x] Cliente Prisma configurado
- [x] Seed script criado
- [x] Documentação completa

### 2. 🚧 Instalação de Dependências

Execute os seguintes comandos:

```bash
# Prisma e cliente
npm install @prisma/client
npm install -D prisma ts-node

# Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Autenticação
npm install next-auth @auth/prisma-adapter

# Validação
npm install zod

# Utilitários
npm install date-fns
npm install react-hook-form
npm install @hookform/resolvers

# Upload de imagens (opcional)
npm install react-dropzone
```

### 3. 🗄️ Setup do Banco de Dados

```bash
# 1. Configurar .env com credenciais do Supabase
cp .env.example .env
# Edite .env com suas credenciais

# 2. Gerar Prisma Client
npm run db:generate

# 3. Aplicar migrations
npm run db:migrate

# 4. Popular com dados de teste
npm run db:seed

# 5. Verificar (abre interface visual)
npm run db:studio
```

### 4. 🔐 Implementar Autenticação

#### a) Configurar NextAuth.js

Crie `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### b) Criar componente de Login

Crie `src/components/auth/LoginButton.tsx`:

```typescript
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={session.user?.image || ""} />
          <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <Button onClick={() => signOut()}>Sair</Button>
      </div>
    );
  }

  return <Button onClick={() => signIn()}>Entrar</Button>;
}
```

### 5. 📝 Criar APIs de Posts

#### a) API: Listar Posts

Crie `src/app/api/posts/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";

    const skip = (page - 1) * limit;

    const where = {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { prompt: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(tag && {
        tags: {
          some: {
            tag: {
              slug: tag,
            },
          },
        },
      }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
```

#### b) API: Criar Post

Continue em `src/app/api/posts/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  try {
    // TODO: Verificar autenticação
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, prompt, negativePrompt, imageUrl, tags, ...rest } = body;

    // Validar dados (usar Zod aqui)
    if (!title || !prompt || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Criar post
    const post = await prisma.post.create({
      data: {
        title,
        prompt,
        negativePrompt,
        imageUrl,
        ...rest,
        userId: session.user.id,
        tags: {
          create:
            tags?.map((tagSlug: string) => ({
              tag: {
                connectOrCreate: {
                  where: { slug: tagSlug },
                  create: {
                    name: tagSlug,
                    slug: tagSlug,
                  },
                },
              },
            })) || [],
        },
      },
      include: {
        user: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
```

### 6. ❤️ Implementar Sistema de Likes

Crie `src/app/api/posts/[id]/like/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = params.id;

    // Verificar se já curtiu
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });

    if (existingLike) {
      // Remover like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      });

      return NextResponse.json({ liked: false });
    } else {
      // Adicionar like
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId,
        },
      });

      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      });

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
```

### 7. 🔄 Atualizar Componentes para Usar Dados Reais

#### a) Atualizar página principal

Modifique `src/app/page.tsx`:

```typescript
import { PostGrid } from "@/components/PostGrid";
import prisma from "@/lib/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      user: true,
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return <PostGrid initialPosts={posts} />;
}
```

#### b) Criar componente PostGrid

Crie `src/components/PostGrid.tsx` com client-side fetching para paginação.

### 8. 📤 Implementar Upload de Imagens

#### a) Configurar Supabase Storage

No dashboard do Supabase:

1. Vá em Storage
2. Crie um bucket chamado "images"
3. Configure as políticas de acesso

#### b) Criar API de upload

Crie `src/app/api/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

### 9. 🧪 Testar Tudo

```bash
# 1. Verificar banco de dados
npm run db:studio

# 2. Iniciar servidor
npm run dev

# 3. Testar endpoints
# GET /api/posts
# POST /api/posts
# POST /api/posts/[id]/like
# POST /api/upload
```

## 📚 Recursos Úteis

- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 🎯 Ordem de Implementação Recomendada

1. ✅ Setup do banco (você está aqui!)
2. 🔐 Autenticação
3. 📝 APIs de posts (GET/POST)
4. ❤️ Sistema de likes
5. 📤 Upload de imagens
6. 🔄 Migração dos componentes
7. 💬 Sistema de comentários
8. 👤 Páginas de perfil
9. 🏷️ Sistema de tags completo
10. 📚 Coleções

Boa sorte! 🚀
