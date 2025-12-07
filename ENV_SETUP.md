# 🔐 Guia de Configuração - Arquivo .env

## 📝 Visão Geral

O arquivo `.env` contém todas as variáveis de ambiente necessárias para o projeto funcionar. Este arquivo **NÃO deve ser commitado** no Git (já está no `.gitignore`).

## 🚀 Setup Rápido

### 1. Copie o arquivo de exemplo

```bash
cp .env.example .env
```

### 2. Configure cada variável

Abra o arquivo `.env` e preencha com suas credenciais.

## 📋 Variáveis Obrigatórias

### Database (Supabase)

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].supabase.com:5432/postgres"
```

**Onde encontrar:**

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Settings** → **Database**
3. Role até **Connection String**
4. Copie a **Connection Pooling String** → `DATABASE_URL`
5. Copie a **Direct Connection String** → `DIRECT_URL`
6. Substitua `[YOUR-PASSWORD]` pela senha do banco

### Supabase API

```env
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."
```

**Onde encontrar:**

1. No [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Settings** → **API**
3. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
4. **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### NextAuth (Autenticação)

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-secret-key-aqui"
```

**Gerar NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

## 📋 Variáveis Opcionais

### OAuth Providers

#### Google

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**Como obter:**

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto ou selecione um existente
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

#### GitHub

```env
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

**Como obter:**

1. Acesse [GitHub Settings](https://github.com/settings/developers)
2. Clique em **New OAuth App**
3. Configure:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### Upload de Imagens (Cloudinary)

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Como obter:**

1. Crie conta em [Cloudinary](https://cloudinary.com)
2. No Dashboard, copie:
   - Cloud Name
   - API Key
   - API Secret

### App URL

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🔒 Segurança

### ✅ Boas Práticas

- **Nunca commite o arquivo `.env`** (já protegido pelo `.gitignore`)
- **Não compartilhe suas credenciais** em mensagens, issues, ou PRs
- **Use secrets diferentes** para desenvolvimento e produção
- **Rotacione as keys regularmente** se houver suspeita de vazamento

### 🚨 Se suas credenciais vazarem:

1. **Regenere imediatamente** todas as keys no Supabase
2. **Revogue tokens** OAuth nos respectivos serviços
3. **Atualize o `.env`** com as novas credenciais
4. **Reinicie o servidor** de desenvolvimento

## 🌍 Ambientes

### Desenvolvimento (Local)

Arquivo: `.env`

```env
DATABASE_URL="postgresql://..."  # Supabase Development
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
```

### Produção (Vercel/Deploy)

Configure as variáveis de ambiente diretamente na plataforma:

#### Vercel

1. Vá em **Settings** → **Environment Variables**
2. Adicione cada variável
3. Selecione os ambientes (Production, Preview, Development)

#### Netlify

1. Vá em **Site settings** → **Environment variables**
2. Adicione cada variável

#### Railway

1. Vá em **Variables**
2. Adicione cada variável

## 🧪 Verificar Configuração

### Teste de Conexão com Banco

```bash
npx prisma db pull
```

Se funcionar, sua `DATABASE_URL` está correta.

### Teste de Geração do Cliente

```bash
npm run db:generate
```

### Visualizar Dados

```bash
npm run db:studio
```

Abre interface em http://localhost:5555

## 📝 Exemplo Completo

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.abcdefg:S3cr3tP@ss@aws-0-us-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.abcdefg:S3cr3tP@ss@aws-0-us-west-1.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://abcdefg.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gerado-com-openssl-rand-base64-32"

# OAuth (opcional)
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123def456"

GITHUB_CLIENT_ID="Iv1.abc123def456"
GITHUB_CLIENT_SECRET="abc123def456ghi789"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## ❓ Troubleshooting

### "Cannot find module '@prisma/client'"

```bash
npm install @prisma/client
npm run db:generate
```

### "P1001: Can't reach database server"

- Verifique se a `DATABASE_URL` está correta
- Confirme que seu IP está permitido no Supabase
- Teste a conexão: `npx prisma db pull`

### "Invalid environment variable"

- Verifique se todas as variáveis obrigatórias estão preenchidas
- Confirme que não há espaços extras
- Aspas duplas são recomendadas para URLs complexas

## 📚 Recursos

- [Supabase Docs - Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Prisma Docs - Connection URLs](https://www.prisma.io/docs/reference/database-reference/connection-urls)
- [NextAuth.js Docs - Configuration](https://next-auth.js.org/configuration/options)

---

**⚠️ Lembre-se:** O arquivo `.env` é pessoal e específico do seu ambiente. Cada desenvolvedor deve ter seu próprio arquivo com suas credenciais.
