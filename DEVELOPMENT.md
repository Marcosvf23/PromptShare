# Guia de Desenvolvimento - PromptShare

## 🎯 Visão Geral do Projeto

Este é um site de comunidade onde usuários podem compartilhar imagens geradas por IA junto com os prompts utilizados. Outros membros da comunidade podem visualizar, curtir e copiar os prompts para usar em suas próprias criações.

## 🏗️ Arquitetura Atual

### Frontend (Atual)

- **Framework**: Next.js 15 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Estado**: React useState/useMemo (local)
- **Dados**: Mock data (armazenamento temporário no navegador)

### Componentes Principais

1. **page.tsx** - Página principal com galeria de prompts
2. **PromptCard.tsx** - Card individual de prompt com imagem
3. **UploadDialog.tsx** - Modal para adicionar novos prompts
4. **SearchBar.tsx** - Busca em tempo real

## 🚀 Próximas Etapas de Desenvolvimento

### Fase 1: Autenticação e Backend (Recomendado)

#### Opção A: Supabase (Mais Rápido)

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

**Recursos**:

- Autenticação integrada (Google, GitHub, Email)
- Banco de dados PostgreSQL
- Storage para imagens
- Realtime subscriptions

**Estrutura de Tabelas**:

```sql
-- Users (gerenciado pelo Supabase Auth)

-- Prompts
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);

-- Prompt_Tags (relação muitos-para-muitos)
CREATE TABLE prompt_tags (
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, tag_id)
);

-- Likes
CREATE TABLE likes (
  user_id UUID REFERENCES auth.users(id),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, prompt_id)
);
```

#### Opção B: Next.js + Prisma + PostgreSQL

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

#### Opção C: Firebase (Alternativa)

- Boa documentação
- Realtime database
- Storage integrado

### Fase 2: Upload de Imagens Real

#### Opção A: Cloudinary (Recomendado)

```bash
npm install cloudinary next-cloudinary
```

#### Opção B: AWS S3

```bash
npm install @aws-sdk/client-s3
```

#### Opção C: Supabase Storage (se usar Supabase)

- Já incluído no Supabase

### Fase 3: Funcionalidades Avançadas

1. **Sistema de Perfis**

   - Página de perfil do usuário
   - Histórico de prompts publicados
   - Estatísticas (views, likes totais)

2. **Sistema de Comentários**

   - Comentários em prompts
   - Respostas aninhadas
   - Notificações

3. **Categorias e Filtros**

   - Filtrar por categoria (Paisagem, Retrato, Abstrato, etc.)
   - Filtrar por estilo (Realista, Cartoon, Anime, etc.)
   - Ordenação (Mais recentes, Mais curtidos, Trending)

4. **Sistema de Favoritos**

   - Salvar prompts favoritos
   - Criar coleções personalizadas

5. **Social Features**
   - Seguir outros usuários
   - Feed personalizado
   - Compartilhar em redes sociais

### Fase 4: Melhorias de Performance

1. **Otimizações**

   - Lazy loading de imagens
   - Infinite scroll
   - Cache de dados
   - CDN para imagens

2. **SEO**
   - Metadata dinâmica
   - Open Graph tags
   - Sitemap
   - robots.txt

## 📁 Estrutura de Pastas Sugerida (Futura)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── profile/
│   │   └── [username]/
│   ├── prompt/
│   │   └── [id]/
│   └── api/
│       ├── prompts/
│       ├── likes/
│       └── upload/
├── components/
│   ├── auth/
│   ├── profile/
│   └── shared/
├── lib/
│   ├── supabase/
│   ├── utils/
│   └── validations/
└── types/
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente (.env)

```env
# Database (Supabase example)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Storage (Cloudinary example)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Auth (NextAuth.js example)
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# OAuth (opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🛡️ Segurança

1. **Validação de Inputs**

   - Usar Zod para validação de schemas
   - Sanitizar HTML em comentários
   - Limitar tamanho de upload

2. **Rate Limiting**

   - Limitar uploads por usuário
   - Proteger APIs contra spam

3. **Moderação**
   - Sistema de reportar conteúdo
   - Revisão de conteúdo sensível

## 📊 Analytics (Opcional)

```bash
# Google Analytics
npm install @next/third-parties

# Ou Vercel Analytics
npm install @vercel/analytics
```

## 🚀 Deploy

### Vercel (Recomendado para Next.js)

```bash
npm install -g vercel
vercel
```

### Outras Opções

- Netlify
- AWS Amplify
- Railway
- Render

## 📚 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)

## 🤝 Contribuindo

Para adicionar novas funcionalidades:

1. Criar uma branch feature
2. Implementar e testar localmente
3. Fazer commit com mensagens descritivas
4. Abrir PR para revisão

## 📝 Notas Importantes

- **Performance**: Sempre otimizar imagens antes de fazer upload
- **Acessibilidade**: Adicionar alt text em todas as imagens
- **Responsividade**: Testar em diferentes tamanhos de tela
- **Loading States**: Adicionar skeletons para melhor UX
