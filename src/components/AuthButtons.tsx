"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/LoginDialog";
import { SignupDialog } from "@/components/SignupDialog";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AuthButtons() {
  const { data: session, status } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (status === "loading") {
    return (
      <div className="h-9 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
    );
  }

  if (session?.user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name || ""}
                />
                <AvatarFallback>
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user.name}
                </p>
                <p className="text-xs leading-none text-zinc-500">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <LoginDialog
          open={showLogin}
          onOpenChange={setShowLogin}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
        <SignupDialog
          open={showSignup}
          onOpenChange={setShowSignup}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setShowLogin(true)}>
          <LogIn className="mr-2 h-4 w-4" />
          Entrar
        </Button>
        <Button size="sm" onClick={() => setShowSignup(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Criar conta
        </Button>
      </div>

      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupDialog
        open={showSignup}
        onOpenChange={setShowSignup}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}
