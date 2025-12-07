export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
    username?: string;
  };
  likes: number;
  createdAt: Date;
  tags: string[];
}
