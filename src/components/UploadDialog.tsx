"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface UploadDialogProps {
  onSubmit?: (data: any) => void;
}

export function UploadDialog({ onSubmit }: UploadDialogProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tags, setTags] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [model, setModel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      setError("Você precisa estar logado para fazer upload");
      return;
    }

    if (!title || !prompt || !imagePreview) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          prompt,
          imageUrl: imagePreview,
          model: model || null,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao criar post");
      }

      const newPost = await response.json();

      // Notificar componente pai se callback fornecido
      if (onSubmit) {
        onSubmit(newPost);
      }

      // Mostrar sucesso
      setSuccess(true);

      // Aguardar um pouco e fechar
      setTimeout(() => {
        // Reset form
        setTitle("");
        setPrompt("");
        setTags("");
        setModel("");
        setImagePreview("");
        setSuccess(false);
        setOpen(false);

        // Recarregar página para mostrar novo post
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Erro ao criar post:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao criar post"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Compartilhar Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Compartilhar Novo Prompt</DialogTitle>
          <DialogDescription>
            Compartilhe sua imagem e o prompt usado para criá-la com a
            comunidade.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image">Imagem</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>
            {imagePreview && (
              <div className="relative w-full h-48 mt-2 rounded-md overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ex: Paisagem futurista ao pôr do sol"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Cole aqui o prompt que você usou para gerar a imagem..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">Modelo (opcional)</Label>
            <Input
              id="model"
              placeholder="Ex: DALL-E 3, Midjourney v6, Stable Diffusion XL"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              placeholder="Ex: paisagem, futurista, cyberpunk"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Mensagens de erro e sucesso */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle className="h-4 w-4" />
              <span>Post criado com sucesso!</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title || !prompt || !imagePreview || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Publicar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
