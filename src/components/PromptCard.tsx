"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Copy, Check, Loader2 } from "lucide-react";
import { Prompt } from "@/types";

export interface PromptCardProps extends Prompt {
  onLike?: (id: string, newCount: number) => void;
}

export function PromptCard(props: PromptCardProps) {
  const { onLike, ...prompt } = props;
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(prompt.likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = async () => {
    if (isLiking || !session?.user?.id) return;

    const userId = session.user.id;

    setIsLiking(true);
    const previousLiked = liked;
    const previousCount = likeCount;

    // Atualização otimista
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      const response = await fetch(`/api/posts/${prompt.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Falha ao processar like");
      }

      const data = await response.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);

      // Notificar componente pai se callback fornecido
      if (onLike) {
        onLike(prompt.id, data.likeCount);
      }
    } catch (error) {
      console.error("Erro ao dar like:", error);
      // Reverter em caso de erro
      setLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <Link href={`/posts/${prompt.id}`}>
          <div className="relative w-full aspect-square cursor-pointer">
            <Image
              src={prompt.imageUrl}
              alt={prompt.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <Link
          href={`/users/${prompt.author.username || "unknown"}`}
          className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={prompt.author.avatar} />
            <AvatarFallback>{prompt.author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{prompt.author.name}</span>
        </Link>
        <Link href={`/posts/${prompt.id}`}>
          <h3 className="font-semibold mb-2 text-lg hover:text-primary cursor-pointer">
            {prompt.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {prompt.prompt}
        </p>
        <div className="flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLiking}
          className={liked ? "text-red-500" : ""}
        >
          {isLiking ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
          )}
          {likeCount}
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              Copiar Prompt
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
