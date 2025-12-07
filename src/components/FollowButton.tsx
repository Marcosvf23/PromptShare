"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  username: string;
  isOwnProfile?: boolean;
  onFollowChange?: (following: boolean) => void;
}

export function FollowButton({
  username,
  isOwnProfile = false,
  onFollowChange,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Verificar status de seguindo ao montar
  useEffect(() => {
    async function checkFollowStatus() {
      if (!session?.user) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${username}/follow`);
        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data.following);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsChecking(false);
      }
    }

    checkFollowStatus();
  }, [username, session]);

  const handleToggleFollow = async () => {
    if (!session?.user) {
      // Aqui você pode abrir um modal de login
      alert("Faça login para seguir usuários");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/users/${username}/follow`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao processar solicitação");
      }

      const data = await response.json();
      setIsFollowing(data.following);

      // Notificar componente pai sobre a mudança
      if (onFollowChange) {
        onFollowChange(data.following);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao processar solicitação"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Não mostrar botão se for o próprio perfil
  if (isOwnProfile) {
    return null;
  }

  // Não mostrar se não estiver logado
  if (!session?.user) {
    return (
      <Button variant="outline" size="sm" onClick={handleToggleFollow}>
        <UserPlus className="mr-2 h-4 w-4" />
        Seguir
      </Button>
    );
  }

  if (isChecking) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Carregando...
      </Button>
    );
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleToggleFollow}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : isFollowing ? (
        <>
          <UserMinus className="mr-2 h-4 w-4" />
          Deixar de seguir
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Seguir
        </>
      )}
    </Button>
  );
}
