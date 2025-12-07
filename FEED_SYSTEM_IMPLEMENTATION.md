# Feed Personalizado - PromptShare

## ✅ Status: Implementado e Funcional

Sistema completo de feed personalizado que mostra posts de usuários que você segue, com fallback para posts populares.

## 🎯 Funcionalidades Implementadas

### API de Feed
- ✅ `GET /api/feed` - Feed personalizado baseado em seguindo
- ✅ Retorna posts de quem você segue (máx. 50 posts)
- ✅ Fallback para posts populares se não seguir ninguém
- ✅ Posts populares para usuários não autenticados
- ✅ Ordenação cronológica para feed following
- ✅ Ordenação por likes para posts populares

### Página de Feed (/feed)
- ✅ Interface dedicada para o feed personalizado
- ✅ Indicador visual do tipo de feed (following/popular)
- ✅ Contador de usuários seguidos
- ✅ Estado vazio com CTA para explorar
- ✅ Proteção para usuários não autenticados
- ✅ Loading state durante carregamento

### Navegação Global
- ✅ Navbar com links para Explorar, Feed e Perfil
- ✅ Highlight do link ativo
- ✅ Responsivo mobile (esconde nav em telas pequenas)
- ✅ Integrado em todas as páginas principais

## 🏗️ Arquitetura

### Novos Arquivos

```
src/
├── app/
│   ├── api/
│   │   └── feed/
│   │       └── route.ts              # API de feed personalizado
│   └── feed/
│       ├── page.tsx                  # Página do feed
│       └── layout.tsx                # Metadata e SEO
└── components/
    └── Navbar.tsx                    # Navbar global com navegação
```

### Arquivos Modificados

```
src/
├── app/
│   └── page.tsx                      # Usa Navbar component
├── components/
│   ├── PromptCard.tsx                # Interface ajustada para spread props
│   └── UserProfileClient.tsx         # Props ajustadas
```

## 📊 Fluxo de Dados

### 1. Usuário Autenticado Seguindo Pessoas
```
GET /api/feed → Verifica auth → Busca followings → Retorna posts recentes
                                                   ↓
                                             {type: "following", 
                                              followingCount: N}
```

### 2. Usuário Autenticado Não Seguindo Ninguém
```
GET /api/feed → Verifica auth → followings.length === 0 → Posts populares
                                                          ↓
                                                    {type: "popular",
                                                     message: "..."}
```

### 3. Usuário Não Autenticado
```
GET /api/feed → Sem auth → Posts populares (top 20)
                          ↓
                    {type: "popular"}
```

## 🔐 Lógica de Feed

### Prioridades

1. **Following Feed (Preferencial)**
   - Usuário autenticado + segue >= 1 pessoa
   - Mostra até 50 posts mais recentes
   - Ordenação: `createdAt DESC`

2. **Popular Feed (Fallback)**
   - Usuário não autenticado OU não segue ninguém
   - Mostra top 20 posts
   - Ordenação: `likes DESC`, depois `createdAt DESC`

### Estrutura da Response

```typescript
{
  posts: PostWithRelations[],
  type: "following" | "popular",
  followingCount?: number,       // Apenas se type === "following"
  message?: string               // Mensagem explicativa
}
```

## 📝 Componentes

### Navbar Component

**Props:**
```typescript
interface NavbarProps {
  onSearch?: (query: string) => void;  // Opcional para páginas com busca
}
```

**Features:**
- Logo clicável para home
- Links de navegação (Home, Feed, Perfil)
- Barra de busca (se onSearch fornecido)
- Botão de upload e auth buttons
- Destaque visual do link ativo
- Sticky top com backdrop blur

**Uso:**
```tsx
// Com busca (home)
<Navbar onSearch={setSearchQuery} />

// Sem busca (feed, perfis)
<Navbar />
```

### Feed Page Component

**Estados:**
- `posts` - Array de posts do feed
- `isLoading` - Loading state
- `feedType` - "following" ou "popular"
- `followingCount` - Número de pessoas seguidas

**Views:**
1. **Loading:** Spinner centralizado
2. **Not Authenticated:** CTA para login
3. **Empty State:** Sem posts + botão explorar
4. **Feed Grid:** Grid de posts com PromptCard

## 🎨 UX/UI

### Indicadores Visuais

**Feed Following:**
```tsx
<Users icon /> Posts de N pessoas que você segue
```

**Feed Popular:**
```tsx
<TrendingUp icon /> Posts populares
```

### Estados Vazios

**Following Vazio:**
> "As pessoas que você segue ainda não publicaram nada"
> [Botão: Explorar Posts]

**Não Segue Ninguém:**
> "Comece seguindo pessoas para ver posts personalizados!"
> [Botão: Explorar Posts]

**Não Autenticado:**
> "Faça login para ver posts de pessoas que você segue"
> [Botão: Fazer Login]

## 🚀 Como Usar

### Como Desenvolvedor

**Adicionar feed em nova página:**
```tsx
import { Navbar } from "@/components/Navbar";

export default function MyPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Seu conteúdo */}
      </main>
    </>
  );
}
```

**Verificar tipo de feed via API:**
```bash
# Sem auth → popular
curl http://localhost:3000/api/feed

# Com auth + segue alguém → following
curl http://localhost:3000/api/feed \
  -H "Cookie: authjs.session-token=..."

# Response
{
  "posts": [...],
  "type": "following",
  "followingCount": 3
}
```

### Como Usuário

1. **Acessar Feed**
   - Clicar em "Feed" na navbar
   - Ou acessar `/feed` diretamente

2. **Ver Posts Following**
   - Precisa estar logado
   - Precisa seguir pelo menos 1 pessoa
   - Vê posts em ordem cronológica

3. **Ver Posts Populares**
   - Aparece automaticamente se não seguir ninguém
   - Ou se não estiver logado
   - Posts ordenados por popularidade (likes)

## 🧪 Testes

### Manual Testing

```bash
# 1. Testar não autenticado
curl http://localhost:3000/api/feed
# Deve retornar: type = "popular"

# 2. Login e seguir alguém
# Acessar /feed
# Deve mostrar: "Posts de N pessoas que você segue"

# 3. Login sem seguir ninguém
# Acessar /feed
# Deve mostrar: "Posts populares" + mensagem

# 4. Testar navegação
# Clicar em "Explorar" → Home
# Clicar em "Feed" → Feed page
# Clicar em "Perfil" → Seu perfil
```

### Verificar Build

```bash
npm run build
# Deve passar sem erros TypeScript
# Route /feed deve aparecer como ○ (Static)
```

## 📊 Banco de Dados

### Queries Principais

**Following Feed:**
```prisma
// 1. Buscar quem você segue
follows.findMany({
  where: { followerId: userId },
  select: { followingId: true }
})

// 2. Buscar posts dessas pessoas
posts.findMany({
  where: { userId: { in: followingIds } },
  orderBy: { createdAt: "desc" },
  take: 50
})
```

**Popular Feed:**
```prisma
posts.findMany({
  orderBy: [
    { likes: { _count: "desc" } },
    { createdAt: "desc" }
  ],
  take: 20
})
```

## 🎯 Melhorias Futuras

### Performance
- [ ] Cache de feed por usuário (Redis)
- [ ] Paginação infinita com cursor
- [ ] Prefetch de imagens
- [ ] Virtual scrolling para feeds longos

### Features
- [ ] Filtros no feed (por tag, modelo, data)
- [ ] Ordenação customizável (recente, popular, relevante)
- [ ] "Você perdeu" - resumo de posts enquanto offline
- [ ] Stories/destaques no topo do feed

### Algoritmo
- [ ] Feed com relevância (não só cronológico)
- [ ] Boost de posts com engajamento recente
- [ ] Penalizar repost/duplicatas
- [ ] Diversidade de autores

### Social
- [ ] Compartilhar post no feed
- [ ] Salvar post para ler depois
- [ ] Ocultar posts/usuários
- [ ] Reportar conteúdo inadequado

### Analytics
- [ ] Impressões por post no feed
- [ ] Taxa de clique (CTR)
- [ ] Tempo de visualização
- [ ] Posts mais compartilhados

## 🐛 Detalhes de Implementação

### PromptCard Interface

**Antes:**
```typescript
interface PromptCardProps {
  prompt: Prompt;
}
```

**Depois:**
```typescript
export interface PromptCardProps extends Prompt {
  onLike?: (id: string, newCount: number) => void;
}

// Permite spread operator
<PromptCard {...promptData} />
```

### Navbar Active Link Detection

```typescript
const pathname = usePathname();
const isActive = (path: string) => pathname === path;

<Button variant={isActive("/feed") ? "default" : "ghost"}>
```

### Conditional Search Bar

```typescript
{onSearch && (
  <div className="flex-1 flex justify-center max-w-2xl">
    <SearchBar onSearch={onSearch} />
  </div>
)}
```

## ✨ Características Especiais

### SEO
- Metadata dedicada para `/feed`
- Title: "Feed Personalizado | PromptShare"
- Description otimizada para busca

### Acessibilidade
- Ícones com labels semânticos
- Loading states com spinner visível
- Links com hover states claros
- Keyboard navigation completa

### Performance
- Static generation para layout
- Server-side data fetching na API
- Client-side rendering apenas onde necessário
- Otimização de imagens com Next.js Image

### Mobile
- Navegação responsiva
- Grid adaptativo (1 col mobile → 3 cols desktop)
- Touch-friendly buttons
- Sticky navbar com backdrop blur

---

**Status:** ✅ Feed personalizado 100% funcional!

**Integrado com:**
- ✅ Sistema de follow/unfollow
- ✅ Autenticação NextAuth
- ✅ Navbar global
- ✅ PromptCard component
- ✅ API de posts

**Próximos Passos Sugeridos:**
- 🔔 Sistema de notificações
- ✏️ Editar perfil
- 📷 Upload de imagens (Supabase Storage)
- 🔍 Busca avançada com filtros
