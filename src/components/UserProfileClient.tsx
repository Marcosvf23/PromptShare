"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromptCard } from "@/components/PromptCard";
import { FollowButton } from "@/components/FollowButton";
import {
  ArrowLeft,
  Calendar,
  ImageIcon,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { Prompt } from "@/types";

interface User {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

interface UserProfileClientProps {
  username: string;
}

export function UserProfileClient({ username }: UserProfileClientProps) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Buscar usuário
        const userResponse = await fetch(`/api/users/${username}`);
        if (!userResponse.ok) {
          if (userResponse.status === 404) {
            setError("Usuário não encontrado");
          } else {
            setError("Erro ao carregar perfil");
          }
          return;
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Buscar posts
        const postsResponse = await fetch(`/api/users/${username}/posts`);
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [username]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background">
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
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-lg font-semibold">
            {error || "Usuário não encontrado"}
          </p>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === user.id;

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
        {/* Perfil do Usuário */}
        <div className="mb-8 p-6 border rounded-lg bg-card">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={user.avatarUrl || ""} />
              <AvatarFallback className="text-2xl">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {/* Informações */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {user.name || user.username}
                </h1>
                {user.name && (
                  <p className="text-muted-foreground">@{user.username}</p>
                )}
              </div>

              {/* Estatísticas */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{user.postsCount}</span>
                  <span className="text-muted-foreground text-sm">posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{user.followersCount}</span>
                  <span className="text-muted-foreground text-sm">
                    seguidores
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{user.followingCount}</span>
                  <span className="text-muted-foreground text-sm">
                    seguindo
                  </span>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-sm whitespace-pre-wrap">{user.bio}</p>
              )}

              {/* Data de entrada */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Membro desde {formatDate(user.createdAt)}</span>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <FollowButton
                  username={user.username}
                  isOwnProfile={isOwnProfile}
                  onFollowChange={(following) => {
                    // Atualizar contador de seguidores
                    setUser((prev) =>
                      prev
                        ? {
                            ...prev,
                            followersCount: following
                              ? prev.followersCount + 1
                              : prev.followersCount - 1,
                          }
                        : null
                    );
                  }}
                />
                {!isOwnProfile && (
                  <Button variant="ghost" size="sm">
                    Mensagem
                  </Button>
                )}
                {isOwnProfile && (
                  <Button variant="outline" size="sm">
                    Editar Perfil
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts do Usuário */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Posts de {user.name || user.username}
            </h2>
            <Badge variant="secondary">{posts.length} posts</Badge>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {isOwnProfile
                  ? "Você ainda não publicou nenhum post."
                  : "Este usuário ainda não publicou nenhum post."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PromptCard key={post.id} prompt={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
