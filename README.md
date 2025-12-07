# PromptShare ✨

Uma plataforma de comunidade moderna para compartilhar e descobrir prompts de imagens geradas por IA.

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.1.0-2D3748)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Características Implementadas

### 🔐 Autenticação e Usuários
- ✅ **Autenticação Completa** - Login com email/senha e OAuth (Google, GitHub)
- ✅ **Perfis de Usuário** - Perfis públicos com estatísticas e posts
- ✅ **Sistema de Follow** - Siga outros usuários e veja suas atualizações
- ✅ **Edição de Perfil** - Atualize nome, username, bio e avatar

### 📰 Feed e Conteúdo
- ✅ **Feed Personalizado** - Veja posts de pessoas que você segue
- ✅ **Galeria de Prompts** - Explore todos os prompts da comunidade
- ✅ **Busca em Tempo Real** - Encontre prompts por título, conteúdo ou tags
- ✅ **Detalhes de Post** - Página dedicada com comentários e informações completas

### 💬 Interações Sociais
- ✅ **Sistema de Likes** - Curta seus prompts favoritos com atualização otimista
- ✅ **Comentários** - Comente e interaja com a comunidade
- ✅ **Seguidores** - Sistema completo de follow/unfollow
- ✅ **Contadores em Tempo Real** - Likes, comentários, seguidores atualizados instantaneamente

### 🎨 Interface e UX
- ✅ **Design Moderno** - Interface clean com Tailwind CSS v4 + shadcn/ui
- ✅ **Navegação Global** - Navbar com acesso rápido a Feed, Explorar e Perfil
- ✅ **Responsivo** - Layout adaptativo para mobile, tablet e desktop
- ✅ **Upload de Prompts** - Modal otimizada com scroll para prompts grandes
- ✅ **Estados de Loading** - Feedback visual em todas as interações
- ✅ **Otimistic Updates** - UI atualiza instantaneamente antes da confirmação do servidor

### 🏷️ Organização
- ✅ **Tags Inteligentes** - Sistema de tags para categorização
- ✅ **Criação Automática** - Tags criadas automaticamente ao publicar
- ✅ **Filtragem** - Busque por tags específicas

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16.0.7 (App Router) + TypeScript 5
- **Estilização**: Tailwind CSS v4 + shadcn/ui
- **Autenticação**: NextAuth.js v5 (beta)
- **Banco de Dados**: PostgreSQL via Supabase
- **ORM**: Prisma 7.1.0
- **Validação**: Zod
- **Ícones**: Lucide React
- **Deploy**: Vercel (recomendado)

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git

### 1. Clone o Repositório

```bash
git clone https://github.com/Marcosvf23/PromptShare.git
cd PromptShare
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Banco de Dados

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite .env com suas credenciais do Supabase
# Veja ENV_SETUP.md para guia detalhado
```

**Guia completo:** [DATABASE_SETUP.md](./DATABASE_SETUP.md)

```bash
# Execute as migrations
npm run db:migrate

# Popule com dados de teste
npm run db:seed
```

### 4. Inicie o Servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build para produção
npm run start            # Inicia servidor de produção
npm run lint             # Verifica erros de código

# Banco de Dados
npm run db:generate      # Gera Prisma Client
npm run db:push          # Push schema para o banco (dev)
npm run db:migrate       # Cria e aplica migrations
npm run db:studio        # Abre Prisma Studio
npm run db:seed          # Popula banco com dados de teste
```

## 📁 Estrutura do Projeto

```
PromptShare/
├── prisma/
│   ├── schema.prisma       # Schema do banco de dados
│   ├── prisma.config.ts    # Configuração do Prisma
│   └── seed.ts             # Dados de teste
├── src/
│   ├── app/
│   │   ├── page.tsx        # Página principal
│   │   ├── layout.tsx      # Layout global
│   │   └── globals.css     # Estilos globais
│   ├── components/
│   │   ├── PromptCard.tsx  # Card de prompt
│   │   ├── UploadDialog.tsx # Modal de upload
│   │   ├── SearchBar.tsx   # Barra de busca
│   │   └── ui/             # Componentes shadcn
│   ├── lib/
│   │   ├── prisma.ts       # Cliente Prisma
│   │   └── utils.ts        # Utilitários
│   └── types/
│       ├── index.ts        # Tipos gerais
│       └── database.ts     # Tipos do banco
├── public/                 # Arquivos públicos
├── .env.example            # Exemplo de variáveis
├── .env                    # Variáveis de ambiente (gitignored)
└── README.md               # Este arquivo
```

## 🗄️ Schema do Banco de Dados

### Principais Tabelas

- **User** - Usuários da plataforma
- **Post** - Posts com prompts e imagens
- **Tag** - Tags para categorização
- **Like** - Sistema de curtidas
- **Comment** - Comentários (com respostas aninhadas)
- **Follows** - Sistema de seguidores
- **Collection** - Coleções de posts

Veja [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) para detalhes completos.

## 🚀 Features Implementadas

### ✅ Autenticação e Segurança
- [x] NextAuth.js v5 com JWT sessions
- [x] Login com credenciais (email + senha)
- [x] OAuth providers prontos (Google, GitHub)
- [x] Hash de senhas com bcryptjs
- [x] Proteção de rotas e APIs
- [x] Atualização de sessão em tempo real

### ✅ Gestão de Perfis
- [x] Perfis públicos com estatísticas
- [x] Edição de perfil (nome, username, bio, avatar)
- [x] Validações com Zod
- [x] Username único com verificação
- [x] Contador de posts/seguidores/seguindo

### ✅ Sistema Social
- [x] Follow/Unfollow com atualização otimista
- [x] Feed personalizado (posts de quem você segue)
- [x] Feed popular (fallback)
- [x] Likes com contadores em tempo real
- [x] Sistema de comentários
- [x] Navegação entre perfis

### ✅ Gestão de Conteúdo
- [x] CRUD completo de posts
- [x] Upload com preview de imagem
- [x] Sistema de tags automático
- [x] Busca em tempo real
- [x] Página de detalhes do post
- [x] Modal otimizada para prompts grandes

### ✅ UX/UI
- [x] Design responsivo (mobile-first)
- [x] Navbar global com navegação
- [x] Estados de loading e erro
- [x] Feedback visual em todas ações
- [x] Otimistic UI updates
- [x] SEO otimizado

## 🎯 Próximas Features

### 📋 Em Planejamento
- [ ] Sistema de notificações
- [ ] Upload de imagens para Supabase Storage
- [ ] Coleções de posts favoritos
- [ ] Busca avançada com filtros
- [ ] Mensagens diretas entre usuários
- [ ] Analytics de perfil
- [ ] Sistema de badges e conquistas
- [ ] Dark mode
- [ ] Exportação de prompts
- [ ] API pública para desenvolvedores

## 📚 Documentação Completa

### 📖 Guias de Setup
- [ENV_SETUP.md](./ENV_SETUP.md) - Configuração de variáveis de ambiente
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Setup do banco de dados Supabase
- [QUICKSTART.md](./QUICKSTART.md) - Guia rápido para começar

### 🔧 Documentação Técnica
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Schema do banco e diagramas
- [AUTHENTICATION_IMPLEMENTATION.md](./AUTHENTICATION_IMPLEMENTATION.md) - Sistema de autenticação
- [POST_DETAILS_IMPLEMENTATION.md](./POST_DETAILS_IMPLEMENTATION.md) - Página de detalhes e comentários
- [USER_PROFILE_IMPLEMENTATION.md](./USER_PROFILE_IMPLEMENTATION.md) - Sistema de perfis
- [FOLLOW_SYSTEM_IMPLEMENTATION.md](./FOLLOW_SYSTEM_IMPLEMENTATION.md) - Sistema de follow/unfollow
- [FEED_SYSTEM_IMPLEMENTATION.md](./FEED_SYSTEM_IMPLEMENTATION.md) - Feed personalizado
- [EDIT_PROFILE_IMPLEMENTATION.md](./EDIT_PROFILE_IMPLEMENTATION.md) - Edição de perfil

### 📋 Planejamento
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Próximas implementações
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guia de desenvolvimento
- [DESIGN.md](./DESIGN.md) - Especificações de design

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para mais detalhes

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io)
- [Supabase](https://supabase.com)
- [Unsplash](https://unsplash.com) - Imagens de exemplo

## 🎓 Aprendizados do Projeto

Este projeto foi desenvolvido como estudo prático de:
- Next.js 16 com App Router e Server Components
- Sistema de autenticação moderno com NextAuth.js v5
- Integração completa com Prisma e PostgreSQL
- Otimistic UI updates para melhor UX
- Validações robustas com Zod
- Design system com shadcn/ui e Tailwind CSS v4
- Deployment e CI/CD com Vercel

## 📧 Contato

**Marcos Fernandes** - [@Marcosvf23](https://github.com/Marcosvf23)

Link do Projeto: [https://github.com/Marcosvf23/PromptShare](https://github.com/Marcosvf23/PromptShare)

---

⭐ Se este projeto te ajudou ou inspirou, considere dar uma estrela!
