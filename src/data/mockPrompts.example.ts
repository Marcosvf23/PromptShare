// Arquivo de exemplo para adicionar novos prompts mock
// Use este arquivo para adicionar mais exemplos ao mockPrompts

export const additionalMockPrompts = [
  {
    id: "5",
    title: "Astronauta no Espaço",
    prompt: "Astronaut floating in deep space, Earth in background, starfield, photorealistic, cinematic lighting, 8k resolution, ultra detailed space suit",
    imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&auto=format&fit=crop",
    author: {
      name: "Carlos Mendes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
    },
    likes: 189,
    createdAt: new Date("2024-01-11"),
    tags: ["espaço", "astronauta", "realista"],
  },
  {
    id: "6",
    title: "Floresta Mágica",
    prompt: "Magical enchanted forest, glowing mushrooms, fairy lights, mystical atmosphere, fantasy landscape, detailed vegetation, dreamy lighting, ethereal",
    imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop",
    author: {
      name: "Beatriz Lima",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatriz",
    },
    likes: 167,
    createdAt: new Date("2024-01-10"),
    tags: ["fantasia", "floresta", "mágico"],
  },
  {
    id: "7",
    title: "Samurai Futurista",
    prompt: "Futuristic samurai warrior, cyberpunk armor, neon katana, Tokyo street background, rain effects, dramatic pose, highly detailed, concept art style",
    imageUrl: "https://images.unsplash.com/photo-1589254066213-a0c9dc853511?w=800&auto=format&fit=crop",
    author: {
      name: "Rafael Tanaka",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rafael",
    },
    likes: 234,
    createdAt: new Date("2024-01-09"),
    tags: ["samurai", "cyberpunk", "guerreiro"],
  },
  {
    id: "8",
    title: "Café Aconchegante",
    prompt: "Cozy coffee shop interior, warm lighting, wooden furniture, plants, books on shelves, steam from coffee cup, afternoon sun rays, hygge aesthetic",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop",
    author: {
      name: "Juliana Ferreira",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juliana",
    },
    likes: 145,
    createdAt: new Date("2024-01-08"),
    tags: ["interior", "café", "aconchegante"],
  },
  {
    id: "9",
    title: "Dragão Oriental",
    prompt: "Chinese dragon flying through clouds, traditional art style, gold and red colors, detailed scales, mystical atmosphere, flowing movement, ancient mythology",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop",
    author: {
      name: "Wei Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wei",
    },
    likes: 298,
    createdAt: new Date("2024-01-07"),
    tags: ["dragão", "oriental", "mitologia"],
  },
  {
    id: "10",
    title: "Cidade Subaquática",
    prompt: "Underwater futuristic city, bioluminescent buildings, schools of fish, coral architecture, glass domes, ray of light from surface, sci-fi concept art",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop",
    author: {
      name: "Marina Souza",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marina",
    },
    likes: 312,
    createdAt: new Date("2024-01-06"),
    tags: ["subaquático", "futurista", "cidade"],
  },
  {
    id: "11",
    title: "Gatinho Kawaii",
    prompt: "Cute kawaii kitten, big eyes, pastel colors, chibi art style, fluffy fur, playful pose, anime aesthetic, adorable expression, soft lighting",
    imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop",
    author: {
      name: "Sakura Yamamoto",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sakura",
    },
    likes: 421,
    createdAt: new Date("2024-01-05"),
    tags: ["kawaii", "anime", "fofo"],
  },
  {
    id: "12",
    title: "Steampunk Airship",
    prompt: "Victorian steampunk airship, brass and copper details, steam engines, gears and cogs, floating above clouds, vintage aesthetic, detailed mechanical parts",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop",
    author: {
      name: "Thomas Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=thomas",
    },
    likes: 187,
    createdAt: new Date("2024-01-04"),
    tags: ["steampunk", "vitoriano", "aeronave"],
  },
];

// Instruções de uso:
// 1. Copie os prompts que desejar
// 2. Cole no array mockPrompts em src/app/page.tsx
// 3. Ajuste os IDs para serem sequenciais
// 4. Personalize as informações conforme necessário
