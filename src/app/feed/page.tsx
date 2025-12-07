"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PromptCard } from "@/components/PromptCard";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { PostWithRelations } from "@/types/database";

type FeedType = "following" | "popular";

export default function FeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedType, setFeedType] = useState<FeedType>("following");
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    fetchFeed();
  }, [session]);

  const fetchFeed = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/feed");
      const data = await response.json();

      setPosts(data.posts || []);
      setFeedType(data.type || "popular");
      setFollowingCount(data.followingCount || 0);
    } catch (error) {
      console.error("Erro ao carregar feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4">Feed Personalizado</h1>
          <p className="text-gray-600 mb-8">
            Faça login para ver posts de pessoas que você segue
          </p>
          <Button asChild>
            <Link href="/auth/signin">Fazer Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Seu Feed</h1>
          <div className="flex items-center gap-4">
            {feedType === "following" ? (
              <p className="text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Posts de {followingCount}{" "}
                {followingCount === 1 ? "pessoa" : "pessoas"} que você segue
              </p>
            ) : (
              <p className="text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Posts populares
              </p>
            )}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Nenhum post ainda</h3>
            <p className="text-gray-600 mb-6">
              {feedType === "following"
                ? "As pessoas que você segue ainda não publicaram nada. Que tal explorar mais usuários?"
                : "Comece seguindo pessoas para ver posts personalizados!"}
            </p>
            <Button asChild>
              <Link href="/">Explorar Posts</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PromptCard
                key={post.id}
                id={post.id}
                title={post.title}
                prompt={post.prompt}
                imageUrl={post.imageUrl || post.thumbnailUrl || ""}
                author={{
                  name: post.user.name || post.user.username || "Usuário",
                  avatar: post.user.avatarUrl || "",
                  username: post.user.username || "",
                }}
                likes={post._count?.likes || 0}
                createdAt={new Date(post.createdAt)}
                tags={post.tags.map(
                  (pt: { tag: { name: string } }) => pt.tag.name
                )}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
