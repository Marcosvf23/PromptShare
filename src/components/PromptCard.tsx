"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Copy, Check } from "lucide-react";
import { Prompt } from "@/types";

interface PromptCardProps {
  prompt: Prompt;
  onLike: (id: string) => void;
}

export function PromptCard({ prompt, onLike }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    onLike(prompt.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-square">
          <Image
            src={prompt.imageUrl}
            alt={prompt.title}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={prompt.author.avatar} />
            <AvatarFallback>{prompt.author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{prompt.author.name}</span>
        </div>
        <h3 className="font-semibold mb-2 text-lg">{prompt.title}</h3>
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
          className={liked ? "text-red-500" : ""}
        >
          <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
          {prompt.likes + (liked ? 1 : 0)}
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
