"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sparkles, Home, Rss, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/AuthButtons";
import { SearchBar } from "@/components/SearchBar";
import { UploadDialog } from "@/components/UploadDialog";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">PromptShare</h1>
          </Link>

          {/* Navigation Links */}
          {session && (
            <nav className="hidden md:flex items-center gap-2">
              <Button variant={isActive("/") ? "default" : "ghost"} asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Explorar
                </Link>
              </Button>
              <Button variant={isActive("/feed") ? "default" : "ghost"} asChild>
                <Link href="/feed">
                  <Rss className="w-4 h-4 mr-2" />
                  Feed
                </Link>
              </Button>
              {session.user?.username && (
                <Button
                  variant={
                    isActive(`/users/${session.user.username}`)
                      ? "default"
                      : "ghost"
                  }
                  asChild
                >
                  <Link href={`/users/${session.user.username}`}>
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </Link>
                </Button>
              )}
            </nav>
          )}

          {/* Search Bar */}
          {onSearch && (
            <div className="flex-1 flex justify-center max-w-2xl">
              <SearchBar onSearch={onSearch} />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <UploadDialog />
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  );
}
