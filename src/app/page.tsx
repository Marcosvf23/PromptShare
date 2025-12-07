"use client";

import { useState, useMemo } from "react";
import { PromptCard } from "@/components/PromptCard";
import { UploadDialog } from "@/components/UploadDialog";
import { SearchBar } from "@/components/SearchBar";
import { Prompt } from "@/types";
import { Sparkles } from "lucide-react";

// Dados de exemplo
const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "Paisagem Cyberpunk Futurista",
    prompt:
      "A futuristic cyberpunk cityscape at night, neon lights reflecting on wet streets, flying cars, towering skyscrapers, detailed, 8k, photorealistic",
    imageUrl:
      "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&auto=format&fit=crop",
    author: {
      name: "João Silva",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
    },
    likes: 142,
    createdAt: new Date("2024-01-15"),
    tags: ["cyberpunk", "futurista", "cidade"],
  },
  {
    id: "2",
    title: "Retrato Artístico de Fantasia",
    prompt:
      "Portrait of a mystical elven warrior, long flowing hair, intricate armor with glowing runes, fantasy art style, highly detailed, dramatic lighting",
    imageUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop",
    author: {
      name: "Maria Costa",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    },
    likes: 98,
    createdAt: new Date("2024-01-14"),
    tags: ["fantasia", "retrato", "guerreiro"],
  },
  {
    id: "3",
    title: "Paisagem Natural Serena",
    prompt:
      "Beautiful mountain landscape at sunrise, misty valleys, golden hour lighting, peaceful lake reflection, ultra realistic, cinematic composition",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    author: {
      name: "Pedro Santos",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
    },
    likes: 215,
    createdAt: new Date("2024-01-13"),
    tags: ["natureza", "paisagem", "montanhas"],
  },
  {
    id: "4",
    title: "Arte Abstrata Colorida",
    prompt:
      "Abstract digital art, vibrant colors, flowing shapes, geometric patterns, modern art style, 4k resolution, high contrast",
    imageUrl:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop",
    author: {
      name: "Ana Oliveira",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
    },
    likes: 76,
    createdAt: new Date("2024-01-12"),
    tags: ["abstrato", "colorido", "digital"],
  },
];

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleNewPrompt = (data: {
    title: string;
    prompt: string;
    imageUrl: string;
    tags: string[];
  }) => {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      ...data,
      author: {
        name: "Você",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      },
      likes: 0,
      createdAt: new Date(),
    };
    setPrompts([newPrompt, ...prompts]);
  };

  const handleLike = (id: string) => {
    setPrompts(
      prompts.map((prompt) =>
        prompt.id === id ? { ...prompt, likes: prompt.likes + 1 } : prompt
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">PromptShare</h1>
            </div>
            <div className="flex-1 flex justify-center max-w-2xl">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <UploadDialog onSubmit={handleNewPrompt} />
          </div>
        </div>
      </header>

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

        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum prompt encontrado. Tente outra busca!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} onLike={handleLike} />
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
