# PromptShare 🎨

Uma plataforma de comunidade moderna para compartilhar e descobrir prompts de imagens geradas por IA.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)

## ✨ Características

- 🖼️ **Galeria de Prompts** - Explore imagens geradas por IA com seus prompts
- 🔍 **Busca Avançada** - Encontre prompts por título, conteúdo ou tags
- ❤️ **Sistema de Likes** - Curta seus prompts favoritos
- 💬 **Comentários** - Discuta e aprenda com a comunidade
- 🏷️ **Tags Inteligentes** - Organize e descubra por categorias
- 👤 **Perfis de Usuário** - Acompanhe criadores favoritos
- 📚 **Coleções** - Salve e organize seus prompts preferidos
- 🎨 **Interface Moderna** - Design responsivo e elegante

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Estilização**: Tailwind CSS v4
- **Componentes UI**: shadcn/ui
- **Banco de Dados**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Autenticação**: NextAuth.js (em breve)
- **Storage**: Supabase Storage
- **Ícones**: Lucide React

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

## 🚧 Roadmap

### Fase 1: Fundação ✅

- [x] Setup inicial do projeto
- [x] Componentes UI básicos
- [x] Schema do banco de dados
- [x] Documentação completa

### Fase 2: Backend (Em Andamento) 🚧

- [ ] Autenticação com NextAuth.js
- [ ] APIs para CRUD de posts
- [ ] Upload de imagens no Supabase Storage
- [ ] Sistema de tags funcionando
- [ ] Migrar para dados reais

### Fase 3: Features Sociais 📅

- [ ] Sistema de perfis
- [ ] Seguidores e feed personalizado
- [ ] Comentários e respostas
- [ ] Notificações
- [ ] Coleções de prompts

## 📚 Documentação

- [ENV_SETUP.md](./ENV_SETUP.md) - **Configuração do arquivo .env**
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Setup do banco de dados
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Diagramas e queries
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Próximas implementações
- [QUICKSTART.md](./QUICKSTART.md) - Guia rápido de uso
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

## 📧 Contato

Marcos Vieira - [@Marcosvf23](https://github.com/Marcosvf23)

Link do Projeto: [https://github.com/Marcosvf23/PromptShare](https://github.com/Marcosvf23/PromptShare)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
