# 🗄️ Guia de Setup do Banco de Dados

## 📋 Pré-requisitos

1. Conta no Supabase (https://supabase.com)
2. Node.js instalado

## 🚀 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com/dashboard
2. Clique em "New Project"
3. Configure:
   - Nome do projeto: `promptshare`
   - Database Password: (anote para usar depois)
   - Region: Escolha a mais próxima

### 2. Obter as Credenciais

No dashboard do Supabase:

1. Vá em **Settings** > **Database**

   - Copie a **Connection String** (modo Session)
   - Essa será sua `DIRECT_URL`
   - Copie também a **Connection Pooling String** (modo Transaction)
   - Essa será sua `DATABASE_URL`

2. Vá em **Settings** > **API**
   - Copie a **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copie a **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copie a **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite `.env` e preencha com suas credenciais:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-xx.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:password@aws-0-xx.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx...xxx"
SUPABASE_SERVICE_ROLE_KEY="eyJxxx...xxx"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-secret-key-gerada"
```

### 4. Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### 5. Instalar Dependências

```bash
npm install @prisma/client
npm install -D prisma
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install next-auth
npm install zod
```

### 6. Inicializar Prisma

O schema já está configurado em `prisma/schema.prisma`.

Gere o Prisma Client:

```bash
npx prisma generate
```

### 7. Criar as Tabelas no Banco

Execute a migration:

```bash
npx prisma migrate dev --name init
```

Isso vai:

- Criar todas as tabelas no Supabase
- Gerar o Prisma Client
- Aplicar os índices

### 8. (Opcional) Popular com Dados de Teste

```bash
npx prisma db seed
```

### 9. Visualizar o Banco de Dados

```bash
npx prisma studio
```

Abrirá uma interface web em http://localhost:5555

## 🔧 Comandos Úteis

```bash
# Gerar Prisma Client após mudanças no schema
npx prisma generate

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Ver status das migrations
npx prisma migrate status

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset

# Abrir Prisma Studio
npx prisma studio

# Formatar schema.prisma
npx prisma format

# Validar schema
npx prisma validate
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

1. **User** - Usuários da plataforma
2. **Post** - Posts com prompts e imagens
3. **Tag** - Tags para categorização
4. **PostTag** - Relação muitos-para-muitos entre Posts e Tags
5. **Like** - Curtidas nos posts
6. **Comment** - Comentários (com suporte a respostas aninhadas)
7. **Follows** - Sistema de seguidores
8. **Collection** - Coleções de posts
9. **CollectionPost** - Posts em coleções

### Melhorias Implementadas

✅ **Campos adicionais no Post:**

- `title` - Título do post
- `thumbnailUrl` - Miniatura otimizada
- `steps`, `seed`, `cfgScale`, `sampler` - Parâmetros técnicos
- `viewCount`, `likeCount`, `commentCount` - Contadores desnormalizados
- `published`, `featured` - Status de publicação

✅ **Sistema de Tags:**

- Tabela separada com slug único
- Contagem de posts por tag
- Relação muitos-para-muitos otimizada

✅ **Sistema de Likes:**

- Constraint único (usuário + post)
- Cascade delete

✅ **Comentários Aninhados:**

- Suporte a respostas (parentId)
- Cascade delete

✅ **Sistema de Seguidores:**

- Relação muitos-para-muitos entre usuários

✅ **Coleções:**

- Usuários podem criar coleções de posts
- Públicas ou privadas

✅ **Índices Otimizados:**

- userId, createdAt, likeCount
- Tags com slug e contagem
- Performance otimizada para queries comuns

## 🔐 Segurança

### Row Level Security (RLS) no Supabase

Execute no SQL Editor do Supabase:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Like" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer um pode ver posts publicados
CREATE POLICY "Anyone can view published posts"
ON "Post" FOR SELECT
USING (published = true);

-- Policy: Usuários podem criar seus próprios posts
CREATE POLICY "Users can create posts"
ON "Post" FOR INSERT
WITH CHECK (auth.uid()::text = "userId");

-- Policy: Usuários podem editar seus próprios posts
CREATE POLICY "Users can edit own posts"
ON "Post" FOR UPDATE
USING (auth.uid()::text = "userId");

-- Policy: Usuários podem deletar seus próprios posts
CREATE POLICY "Users can delete own posts"
ON "Post" FOR DELETE
USING (auth.uid()::text = "userId");

-- Policy: Usuários podem ver seus próprios dados
CREATE POLICY "Users can view own data"
ON "User" FOR SELECT
USING (auth.uid()::text = id);

-- Policy: Usuários podem editar seus próprios dados
CREATE POLICY "Users can update own data"
ON "User" FOR UPDATE
USING (auth.uid()::text = id);
```

## 🧪 Testar Conexão

Crie um script de teste:

```typescript
// scripts/test-db.ts
import prisma from "@/lib/prisma";

async function main() {
  console.log("Testing database connection...");

  const userCount = await prisma.user.count();
  const postCount = await prisma.post.count();

  console.log(`Users: ${userCount}`);
  console.log(`Posts: ${postCount}`);
  console.log("✅ Database connected!");
}

main()
  .catch((e) => {
    console.error("❌ Database connection failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Execute:

```bash
npx ts-node scripts/test-db.ts
```

## 🚨 Troubleshooting

### Erro: "Can't reach database server"

- Verifique se as URLs estão corretas no `.env`
- Confirme que o IP está na whitelist do Supabase (Settings > Database > Connection Pooling)

### Erro: "Auth failed"

- Verifique a senha do banco
- Confirme que está usando a URL correta (Session vs Transaction mode)

### Migrations falhando

- Verifique se há migrations pendentes: `npx prisma migrate status`
- Tente resetar (DEV ONLY): `npx prisma migrate reset`

## 📚 Próximos Passos

1. ✅ Configurar autenticação (NextAuth.js)
2. ✅ Criar APIs para CRUD de posts
3. ✅ Implementar upload de imagens no Supabase Storage
4. ✅ Migrar componentes para usar dados reais
5. ✅ Implementar sistema de tags
6. ✅ Adicionar sistema de likes e comentários

Veja `DEVELOPMENT.md` para mais detalhes!
