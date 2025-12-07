import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentSection } from "@/components/CommentSection";
import { Heart, Copy, Download, ArrowLeft, Calendar } from "lucide-react";

interface Post {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  model: string | null;
  author: {
    id: string;
    username: string | null;
    name: string | null;
    avatarUrl: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  likes: number;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      username: string | null;
      name: string | null;
      avatarUrl: string | null;
    };
  }>;
  createdAt: string;
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Imagem */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Heart className="mr-2 h-4 w-4" />
                {post.likes} Likes
              </Button>
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-6">
            {/* Título e Autor */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{post.title}</h1>

              <Link
                href={`/users/${post.author.username || "unknown"}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatarUrl || ""} />
                  <AvatarFallback>
                    {post.author.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {post.author.name || post.author.username}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </Link>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Prompt</h2>
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border">
                <p className="text-sm whitespace-pre-wrap font-mono">
                  {post.prompt}
                </p>
              </div>
            </div>

            {/* Modelo */}
            {post.model && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Modelo</h2>
                <Badge variant="secondary">{post.model}</Badge>
              </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Comentários */}
            <div className="pt-6 border-t">
              <CommentSection
                postId={post.id}
                initialComments={post.comments}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
