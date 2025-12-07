"use client";

import { useState, useMemo, useEffect } from "react";
import { PromptCard } from "@/components/PromptCard";
import { Navbar } from "@/components/Navbar";
import { Prompt } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar posts da API ao carregar a página
  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/posts");

        if (!response.ok) {
          throw new Error("Falha ao carregar os posts");
        }

        const data = await response.json();

        // Transformar dados da API para o formato do frontend
        const transformedPrompts: Prompt[] = data.map((post: any) => ({
          id: post.id,
          title: post.title,
          prompt: post.prompt,
          imageUrl: post.imageUrl || post.thumbnailUrl,
          author: {
            name: post.author.name,
            avatar: post.author.avatarUrl,
            username: post.author.username,
          },
          likes: post.likes,
          createdAt: new Date(post.createdAt),
          tags: post.tags.map((tag: any) => tag.name),
        }));

        setPrompts(transformedPrompts);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
        setError(
          "Não foi possível carregar os posts. Tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPrompts = useMemo(() => {
    if (!searchQuery) return prompts;

    const query = searchQuery.toLowerCase();
    return prompts.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.prompt.toLowerCase().includes(query) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [prompts, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar onSearch={setSearchQuery} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Explore Prompts da Comunidade
          </h2>
          <p className="text-muted-foreground">
            Descubra e compartilhe prompts incríveis para suas criações com IA
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando prompts...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive font-medium mb-2">
              Erro ao carregar
            </p>
            <p className="text-muted-foreground text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery
                ? "Nenhum prompt encontrado. Tente outra busca!"
                : "Nenhum prompt disponível ainda. Seja o primeiro a compartilhar!"}
            </p>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && !error && filteredPrompts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} {...prompt} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 PromptShare - Comunidade de Prompts de IA
          </p>
        </div>
      </footer>
    </div>
  );
}
