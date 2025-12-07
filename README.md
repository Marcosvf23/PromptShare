# PromptShare

Uma comunidade para compartilhar prompts de imagens geradas por IA.

## 🚀 Características

- ✨ Interface moderna e responsiva
- 🖼️ Upload e compartilhamento de imagens com prompts
- 🔍 Busca por título, prompt ou tags
- ❤️ Sistema de likes
- 📋 Copiar prompts com um clique
- 🏷️ Organização por tags

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar o projeto

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📝 Como usar

1. **Explorar prompts**: Navegue pela galeria de prompts compartilhados pela comunidade
2. **Buscar**: Use a barra de pesquisa para encontrar prompts específicos
3. **Compartilhar**: Clique em "Compartilhar Prompt" para adicionar sua imagem e prompt
4. **Copiar**: Clique em "Copiar Prompt" em qualquer card para usar o prompt
5. **Curtir**: Demonstre apreciação clicando no ❤️

## 🎨 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx          # Página principal
│   └── globals.css       # Estilos globais
├── components/
│   ├── PromptCard.tsx    # Card de exibição de prompt
│   ├── UploadDialog.tsx  # Dialog para upload
│   ├── SearchBar.tsx     # Barra de busca
│   └── ui/               # Componentes shadcn/ui
└── types/
    └── index.ts          # Tipos TypeScript
```

## 🔮 Próximas Funcionalidades

- [ ] Autenticação de usuários
- [ ] Persistência de dados (banco de dados)
- [ ] Filtros avançados por categoria
- [ ] Perfis de usuário
- [ ] Comentários em prompts
- [ ] Sistema de favoritos
- [ ] Upload real de imagens para cloud storage

## 📄 Licença

MIT
