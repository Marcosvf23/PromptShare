# Sistema de Autenticação - PromptShare

## ✅ Status: Implementado e Funcional

A autenticação foi implementada com sucesso usando NextAuth.js v5 (beta) com suporte completo para Next.js 16.

## 🔑 Funcionalidades Implementadas

### Autenticação por Credenciais (Email/Senha)

- ✅ Registro de novos usuários
- ✅ Login com email e senha
- ✅ Hash de senha com bcryptjs
- ✅ Sessão JWT
- ✅ Proteção de rotas

### OAuth Providers (Opcional)

- ✅ Google OAuth (requer configuração)
- ✅ GitHub OAuth (requer configuração)
- 📝 Providers são carregados apenas se as credenciais estiverem configuradas

### Integração com o Sistema

- ✅ Header com botões de Login/Criar Conta
- ✅ Dropdown de usuário com avatar e logout
- ✅ Upload de posts requer autenticação
- ✅ Sistema de likes requer autenticação
- ✅ Sessão persistente com JWT

## 🏗️ Arquitetura

### Arquivos Principais

```
src/
├── lib/
│   ├── auth.ts                 # Configuração principal do NextAuth
│   └── auth.config.ts          # Configuração de providers e callbacks
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts  # Handlers do NextAuth
│   │       └── signup/route.ts         # Endpoint de registro
│   └── auth/
│       └── signin/page.tsx             # Página de autenticação
├── components/
│   ├── Providers.tsx           # SessionProvider wrapper
│   ├── AuthButtons.tsx         # Botões de Login/Signup no header
│   ├── LoginDialog.tsx         # Modal de login
│   └── SignupDialog.tsx        # Modal de cadastro
└── types/
    └── next-auth.d.ts          # Types customizados do NextAuth
```

### Banco de Dados

Tabelas do NextAuth gerenciadas pelo Prisma:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String?   @unique
  name          String?
  password      String?   // Para auth por credenciais
  emailVerified DateTime? // Para OAuth
  image         String?   // Para OAuth
  avatarUrl     String?
  accounts      Account[] // Contas OAuth
  sessions      Session[] // Sessões
}

model Account {
  // Gerencia contas OAuth (Google, GitHub, etc)
}

model Session {
  // Gerencia sessões de usuários
}

model VerificationToken {
  // Para verificação de email
}
```

## 🚀 Como Usar

### 1. Autenticação Básica (Credenciais)

Já está funcionando! Não requer configuração adicional.

**Criar conta:**

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "usuario@example.com",
  "username": "meu_username",
  "name": "Meu Nome",
  "password": "senha_segura"
}
```

**Fazer login:**

- Clique em "Entrar" no header
- Preencha email e senha
- Ou use o botão "Criar conta"

### 2. OAuth (Google/GitHub) - Opcional

Para habilitar OAuth providers, adicione no `.env`:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

**Como obter credenciais:**

**Google:**

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Crie um novo projeto
3. Crie credenciais OAuth 2.0
4. Adicione redirect URL: `http://localhost:3000/api/auth/callback/google`
5. Copie Client ID e Client Secret

**GitHub:**

1. Acesse: https://github.com/settings/developers
2. Crie uma nova OAuth App
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copie Client ID e Client Secret

### 3. Usando a Sessão no Código

**Client Components:**

```tsx
import { useSession } from "next-auth/react";

function MeuComponente() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Carregando...</div>;
  if (!session) return <div>Não autenticado</div>;

  return <div>Olá, {session.user.name}!</div>;
}
```

**Server Components:**

```tsx
import { auth } from "@/lib/auth";

async function MinhaPagina() {
  const session = await auth();

  if (!session) {
    return <div>Acesso negado</div>;
  }

  return <div>Bem-vindo, {session.user.name}!</div>;
}
```

**API Routes:**

```tsx
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Lógica protegida
}
```

## 🔐 Segurança

### Implementado:

- ✅ Hash de senha com bcrypt (10 rounds)
- ✅ Sessão JWT com secret
- ✅ HTTPS ready (produção)
- ✅ Validação de email único
- ✅ Validação de username único
- ✅ Senha mínima de 6 caracteres

### Recomendações para Produção:

- [ ] Implementar rate limiting
- [ ] Adicionar verificação de email
- [ ] Implementar recuperação de senha
- [ ] Adicionar 2FA (autenticação de dois fatores)
- [ ] Implementar CSRF protection
- [ ] Aumentar requisitos de senha
- [ ] Adicionar captcha no registro

## 🧪 Testes

Execute o script de teste:

```bash
./test-auth.sh
```

Isso irá testar:

- Criação de conta
- Validação de credenciais
- Endpoints da API
- Integração com o sistema

## 📝 Variáveis de Ambiente

```bash
# Obrigatórias
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_secret_key_aqui

# Opcionais (OAuth)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
```

## 🎯 Próximos Passos

### Funcionalidades Futuras:

1. **Perfil de Usuário**

   - Página de perfil `/users/[username]`
   - Edição de perfil (avatar, bio, etc)
   - Lista de posts do usuário

2. **Recuperação de Senha**

   - Endpoint de reset de senha
   - Email de verificação
   - Token temporário

3. **Verificação de Email**

   - Email de boas-vindas
   - Link de verificação
   - Badge de verificado

4. **Autorização Granular**
   - Permissões de usuário
   - Roles (admin, moderador, usuário)
   - Proteção de rotas específicas

## 📊 Migração Aplicada

```bash
npx prisma migrate dev --name add_auth
```

A migração `20251207170055_add_auth` adicionou:

- Campo `password` no modelo User
- Campo `emailVerified` no modelo User
- Campo `image` no modelo User
- Modelo Account (OAuth)
- Modelo Session
- Modelo VerificationToken

## 🐛 Troubleshooting

**Erro: "NEXTAUTH_SECRET is missing"**

- Verifique se `.env` contém `NEXTAUTH_SECRET`
- Reinicie o servidor após adicionar

**Erro: "Database connection failed"**

- Verifique `DATABASE_URL` e `DIRECT_URL`
- Confirme que as migrações foram aplicadas

**Erro: "OAuth provider not working"**

- Verifique as credenciais do provider
- Confirme que as redirect URLs estão corretas
- Reinicie o servidor após adicionar credenciais

**Sessão não persiste:**

- Limpe cookies do navegador
- Verifique se `NEXTAUTH_SECRET` não mudou
- Confirme que `session.strategy` está como "jwt"

## ✨ Exemplos de Uso

### Componente Protegido:

```tsx
"use client";

import { useSession } from "next-auth/react";
import { LoginDialog } from "@/components/LoginDialog";

export function ProtectedFeature() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <p>Faça login para acessar este recurso</p>
        <LoginDialog open={true} onOpenChange={() => {}} />
      </div>
    );
  }

  return <div>Conteúdo protegido</div>;
}
```

### Middleware de Proteção:

```tsx
// middleware.ts
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
```

---

**Status:** ✅ Sistema de autenticação totalmente funcional e integrado com a aplicação.
