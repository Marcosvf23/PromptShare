import { Post, User, Tag, Like, Comment, PostTag } from "@prisma/client";

// Post com relações
export type PostWithRelations = Post & {
  user: Pick<User, "id" | "username" | "name" | "avatarUrl">;
  tags: (PostTag & {
    tag: Tag;
  })[];
  likes: Like[];
  comments: Comment[];
  _count?: {
    likes: number;
    comments: number;
  };
};

// User com relações
export type UserWithStats = User & {
  _count?: {
    posts: number;
    likes: number;
    followers: number;
    following: number;
  };
};

// Comment com relações
export type CommentWithUser = Comment & {
  user: Pick<User, "id" | "username" | "name" | "avatarUrl">;
  replies?: CommentWithUser[];
};

// Tag com contagem
export type TagWithCount = Tag & {
  _count?: {
    posts: number;
  };
};

// Tipos para criação
export type CreatePostInput = {
  title: string;
  prompt: string;
  negativePrompt?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  model?: string;
  steps?: number;
  seed?: string;
  cfgScale?: number;
  sampler?: string;
  tags: string[];
};

export type UpdatePostInput = Partial<CreatePostInput> & {
  id: string;
};

export type CreateCommentInput = {
  content: string;
  postId: string;
  parentId?: string;
};

// Tipos de filtros e busca
export type PostFilters = {
  userId?: string;
  tagSlug?: string;
  search?: string;
  model?: string;
  featured?: boolean;
};

export type PostSortBy = "recent" | "popular" | "trending" | "mostLiked";

export type PaginationParams = {
  page?: number;
  limit?: number;
};

// Response types para API
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Tipos de Prisma já existentes
export type { Post, User, Tag, Like, Comment, PostTag } from "@prisma/client";
