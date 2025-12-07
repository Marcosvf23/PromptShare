# Sistema de Edição de Perfil - PromptShare

## ✅ Status: Implementado e Funcional

Sistema completo para edição de perfil com validações, feedback em tempo real e atualização de sessão.

## 🎯 Funcionalidades Implementadas

### API de Perfil

- ✅ `GET /api/profile` - Obter dados do perfil autenticado
- ✅ `PATCH /api/profile` - Atualizar perfil do usuário
- ✅ Validação com Zod schema
- ✅ Verificação de username único
- ✅ Atualização de sessão NextAuth
- ✅ Mensagens de erro detalhadas

### Componente EditProfileDialog

- ✅ Dialog modal com formulário completo
- ✅ Campos: Nome, Username, Bio, Avatar URL
- ✅ Validação em tempo real
- ✅ Contador de caracteres (bio: 500 max)
- ✅ Estados de loading durante salvamento
- ✅ Alerts de erro com feedback claro
- ✅ Reset de form ao fechar modal

### Integração com Perfil

- ✅ Botão "Editar Perfil" no próprio perfil
- ✅ Recarregamento automático após edição
- ✅ Redirecionamento se username mudar
- ✅ Atualização visual imediata

## 🏗️ Arquitetura

### Novos Arquivos

```
src/
├── app/
│   └── api/
│       └── profile/
│           └── route.ts              # API GET/PATCH profile
├── components/
│   ├── EditProfileDialog.tsx         # Modal de edição
│   └── ui/
│       └── alert.tsx                 # Component shadcn Alert
```

### Arquivos Modificados

```
src/
└── components/
    └── UserProfileClient.tsx         # Integra EditProfileDialog
```

## 📊 Fluxo de Dados

### 1. Abrir Dialog

```
User Click "Editar Perfil" → Dialog Open → Carrega dados atuais no form
```

### 2. Submeter Formulário

```
Submit Form → Validação Client-side → POST /api/profile
                                      ↓
                              Validação Zod (Server)
                                      ↓
                              Username único?
                                      ↓
                              Update Database
                                      ↓
                              Retorna {success, user, message}
```

### 3. Pós-Salvamento

```
Response Success → Update NextAuth Session → Close Dialog
                                            ↓
                          Username mudou? → Redirect /users/[newUsername]
                                            ↓
                          Username igual? → Refresh page
                                            ↓
                          Callback onSuccess → Reload profile data
```

## 🔐 Validações

### Schema Zod (Server-side)

```typescript
{
  name: string (1-50 chars, obrigatório)
  username: string (3-20 chars, alphanumeric + _, opcional)
  bio: string (max 500 chars, opcional)
  avatarUrl: string (URL válida, opcional)
}
```

### Regras de Negócio

1. **Nome:** Obrigatório, 1-50 caracteres
2. **Username:**
   - 3-20 caracteres
   - Apenas letras, números e underscore
   - Deve ser único no sistema
   - Opcional (pode ser null)
3. **Bio:** Máximo 500 caracteres, opcional
4. **Avatar URL:** Deve ser URL válida, opcional

### Validação de Username Único

```typescript
// Só valida se username está sendo alterado
if (currentUsername !== newUsername) {
  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) return 409 "Username já está em uso";
}
```

## 📝 Componentes

### EditProfileDialog Component

**Props:**

```typescript
interface EditProfileDialogProps {
  currentUser: {
    name: string | null;
    username: string | null;
    bio: string | null;
    avatarUrl: string | null;
  };
  onSuccess?: () => void; // Callback após sucesso
}
```

**Estados:**

- `open` - Controla visibilidade do dialog
- `isLoading` - Loading durante salvamento
- `error` - Mensagem de erro a exibir
- `formData` - Dados do formulário

**Features:**

- Validação HTML5 (required, maxLength, type="url")
- Reset automático ao fechar sem salvar
- Disabled de todos inputs durante loading
- Alert vermelho para erros
- Botões de Cancelar e Salvar

### API Routes

#### GET /api/profile

**Response 200:**

```json
{
  "id": "clx...",
  "email": "user@example.com",
  "name": "João Silva",
  "username": "joao_silva",
  "bio": "Desenvolvedor Full Stack",
  "avatarUrl": "https://..."
}
```

**Response 401:**

```json
{ "error": "Não autenticado" }
```

#### PATCH /api/profile

**Request Body:**

```json
{
  "name": "João Silva",
  "username": "joao_silva",
  "bio": "Nova bio",
  "avatarUrl": "https://..."
}
```

**Response 200:**

```json
{
  "success": true,
  "user": {
    /* dados atualizados */
  },
  "message": "Perfil atualizado com sucesso"
}
```

**Response 400 (Validação):**

```json
{
  "error": "Dados inválidos",
  "details": [
    {
      "path": ["username"],
      "message": "Username deve ter no mínimo 3 caracteres"
    }
  ]
}
```

**Response 409 (Conflito):**

```json
{
  "error": "Username já está em uso"
}
```

## 🎨 UX/UI

### Estados do Dialog

**Normal:**

- Todos campos editáveis
- Botões ativos
- Sem alertas

**Loading:**

- Todos campos disabled
- Botão "Salvando..." com spinner
- Cancelar disabled

**Erro:**

- Alert vermelho no topo
- Campos editáveis (pode corrigir)
- Botões ativos

**Sucesso:**

- Dialog fecha automaticamente
- Página atualiza ou redireciona
- Dados visíveis no perfil

### Feedback Visual

**Contador de Caracteres:**

```
Bio: [textarea]
     450/500  ← Texto cinza, atualiza em tempo real
```

**Campo Username:**

```
Username: [input]
Apenas letras, números e underline (_). Mín. 3 caracteres.
```

**Alert de Erro:**

```
┌─────────────────────────────────────┐
│ ⚠️ Username já está em uso          │
└─────────────────────────────────────┘
```

## 🚀 Como Usar

### Como Desenvolvedor

**Usar EditProfileDialog em outro lugar:**

```tsx
import { EditProfileDialog } from "@/components/EditProfileDialog";

<EditProfileDialog
  currentUser={{
    name: user.name,
    username: user.username,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
  }}
  onSuccess={() => {
    console.log("Perfil atualizado!");
    // Recarregar dados
  }}
/>;
```

**Testar API manualmente:**

```bash
# GET profile
curl http://localhost:3000/api/profile \
  -H "Cookie: authjs.session-token=..."

# PATCH profile
curl -X PATCH http://localhost:3000/api/profile \
  -H "Cookie: authjs.session-token=..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Nome",
    "username": "novo_username",
    "bio": "Nova biografia"
  }'
```

### Como Usuário

1. **Acessar próprio perfil**

   - Navbar → Perfil OU /users/[seu_username]

2. **Abrir editor**

   - Clicar em "Editar Perfil"

3. **Editar campos**

   - Nome: Seu nome completo
   - Username: Identificador único
   - Bio: Descrição pessoal
   - Avatar URL: Link da imagem

4. **Salvar**

   - Botão "Salvar Alterações"
   - Aguardar confirmação
   - Dialog fecha automaticamente

5. **Ver resultado**
   - Alterações aparecem imediatamente
   - Se username mudou, URL atualiza

## 🧪 Testes

### Manual Testing

```bash
# 1. Login e acessar perfil
# 2. Clicar "Editar Perfil"
# 3. Alterar nome → Salvar → Verificar atualização
# 4. Alterar username → Salvar → Verificar redirect
# 5. Tentar username existente → Ver erro
# 6. Preencher bio longa (>500) → Ver erro validação
# 7. Username inválido (@, espaço) → Ver erro validação
# 8. Cancelar edição → Verificar não salvou
```

### Edge Cases

**Username duplicado:**

```
Input: "joao_silva" (já existe)
Expected: Error 409 "Username já está em uso"
```

**Username curto:**

```
Input: "ab"
Expected: Client validation error antes de enviar
```

**Bio muito longa:**

```
Input: 501 caracteres
Expected: Client validation (maxLength) + Server validation
```

**Avatar URL inválida:**

```
Input: "não é uma url"
Expected: Client validation (type="url") + Server validation
```

**Não autenticado:**

```
Request sem session
Expected: Error 401 "Não autenticado"
```

## 📊 Banco de Dados

### Query de Update

```typescript
await prisma.user.update({
  where: { id: session.user.id },
  data: {
    name,
    username,
    bio: bio || null, // Converte string vazia para null
    avatarUrl: avatarUrl || null,
  },
});
```

### Verificação de Username

```typescript
const existingUser = await prisma.user.findUnique({
  where: { username }
});

if (existingUser && existingUser.id !== currentUserId) {
  // Username já usado por outra pessoa
  throw Error 409
}
```

## 🎯 Melhorias Futuras

### Upload de Imagens

- [ ] Integrar Supabase Storage
- [ ] Upload de avatar direto (não URL)
- [ ] Crop/resize de imagem
- [ ] Preview antes de salvar

### Campos Adicionais

- [ ] Links de redes sociais
- [ ] Localização
- [ ] Website pessoal
- [ ] Data de nascimento (privado)

### Validações Avançadas

- [ ] Blacklist de usernames proibidos
- [ ] Moderação de bio (palavras ofensivas)
- [ ] Rate limiting de edições (1x por minuto)
- [ ] Log de histórico de mudanças

### UX Melhorada

- [ ] Preview em tempo real das mudanças
- [ ] Unsaved changes warning
- [ ] Undo para reverter última edição
- [ ] Suggestions de username disponíveis

### Segurança

- [ ] Verificação de email ao mudar username
- [ ] Cooldown de 7 dias para mudar username
- [ ] Captcha para prevenir bots
- [ ] 2FA para mudanças sensíveis

## 🐛 Detalhes de Implementação

### Atualização de Sessão NextAuth

```typescript
import { useSession } from "next-auth/react";

const { update } = useSession();

// Após PATCH bem-sucedido
await update({
  name: newName,
  username: newUsername,
  // ... outros campos
});

// NextAuth atualiza cookie e session
```

### Redirect Condicional

```typescript
if (data.user.username !== currentUser.username) {
  // Username mudou, precisa redirecionar
  router.push(`/users/${data.user.username}`);
} else {
  // Username igual, apenas refresh
  router.refresh();
}
```

### Form Reset ao Fechar

```typescript
const handleOpenChange = (newOpen: boolean) => {
  if (!newOpen && !isLoading) {
    // Resetar para valores originais
    setFormData({
      name: currentUser.name || "",
      username: currentUser.username || "",
      bio: currentUser.bio || "",
      avatarUrl: currentUser.avatarUrl || "",
    });
    setError(null);
  }
  setOpen(newOpen);
};
```

### Fetch Data após Edição

```typescript
<EditProfileDialog
  currentUser={user}
  onSuccess={() => {
    // Recarregar dados do perfil
    fetchData();
  }}
/>
```

## ✨ Características Especiais

### Validação em Múltiplas Camadas

1. **HTML5:** required, maxLength, type="url"
2. **Client-side:** Feedback visual imediato
3. **Server-side Zod:** Validação robusta
4. **Database:** Unique constraint no username

### Estado Otimista

- Form fecha imediatamente após sucesso
- Dados atualizados aparecem sem delay
- Background: sessão e DB sendo atualizados

### Error Handling Robusto

- Erros de validação: Alert com detalhes
- Username duplicado: Mensagem específica
- Erro de rede: "Erro ao atualizar perfil"
- Timeout: Request abortion

### Acessibilidade

- Labels associados a inputs (htmlFor)
- Required fields marcados com asterisco
- Placeholders descritivos
- Mensagens de ajuda (hints)
- Keyboard navigation completa
- Focus management (auto-focus em erro)

---

**Status:** ✅ Sistema de edição de perfil 100% funcional!

**Integrado com:**

- ✅ NextAuth.js (session update)
- ✅ Prisma ORM (database updates)
- ✅ Zod (validation schema)
- ✅ shadcn/ui (Dialog, Input, Alert)
- ✅ UserProfileClient (botão + callback)

**Próximos Passos Sugeridos:**

- 🔔 Sistema de notificações
- 📷 Upload de imagens para Supabase Storage
- 🔍 Busca avançada com filtros
- 💬 Sistema de mensagens entre usuários
