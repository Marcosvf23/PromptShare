# 🚀 Quick Start - PromptShare

## Começando Agora

### 1️⃣ O servidor já está rodando!

Acesse: **http://localhost:3000**

### 2️⃣ Explore as Funcionalidades

#### 🔍 Buscar Prompts

- Digite palavras-chave na barra de busca
- Busca em tempo real por título, prompt ou tags
- Exemplo: digite "cyberpunk" ou "natureza"

#### ➕ Adicionar Novo Prompt

1. Clique em **"Compartilhar Prompt"**
2. Faça upload de uma imagem
3. Adicione um título
4. Cole o prompt usado
5. Adicione tags separadas por vírgula
6. Clique em "Publicar"

#### ❤️ Curtir Prompts

- Clique no ícone de coração em qualquer card
- O contador de likes aumentará

#### 📋 Copiar Prompt

- Clique em "Copiar Prompt" em qualquer card
- O prompt será copiado para sua área de transferência
- Use-o em ferramentas de IA como Midjourney, DALL-E, Stable Diffusion, etc.

## 🎨 Exemplos de Prompts

### Para Paisagens

```
Beautiful mountain landscape at sunrise, misty valleys, golden hour lighting,
peaceful lake reflection, ultra realistic, cinematic composition, 8k
```

### Para Retratos

```
Portrait of a mystical elven warrior, long flowing hair, intricate armor with
glowing runes, fantasy art style, highly detailed, dramatic lighting
```

### Para Cidade/Urbano

```
Futuristic cyberpunk cityscape at night, neon lights reflecting on wet streets,
flying cars, towering skyscrapers, detailed, photorealistic
```

### Para Arte Abstrata

```
Abstract digital art, vibrant colors, flowing shapes, geometric patterns,
modern art style, 4k resolution, high contrast
```

## 📱 Testando Responsividade

Redimensione a janela do navegador para ver como o layout se adapta:

- **Mobile**: 1 coluna
- **Tablet**: 2 colunas
- **Desktop**: 3-4 colunas

## 🛠️ Comandos Úteis

### Parar o Servidor

```bash
Ctrl + C
```

### Reiniciar o Servidor

```bash
npm run dev
```

### Build para Produção

```bash
npm run build
npm run start
```

### Verificar Erros

```bash
npm run lint
```

## 🔧 Modificando o Código

### Alterar Cores do Tema

Edite: `src/app/globals.css`

### Adicionar Novos Componentes

```bash
npx shadcn@latest add [component-name]
```

Componentes disponíveis:

- dropdown-menu
- tabs
- select
- checkbox
- radio-group
- switch
- slider
- tooltip
- popover
- e muitos mais...

### Alterar Layout da Página

Edite: `src/app/page.tsx`

### Customizar Cards

Edite: `src/components/PromptCard.tsx`

### Modificar Dialog de Upload

Edite: `src/components/UploadDialog.tsx`

## 🌐 Usando Imagens Reais

Atualmente o projeto usa imagens do Unsplash. Para usar suas próprias imagens:

1. Faça upload através do dialog
2. O preview aparecerá na galeria
3. **Nota**: As imagens são armazenadas apenas no navegador (não persistem após refresh)

Para persistência real, implemente um backend (veja DEVELOPMENT.md)

## 🎯 Próximos Passos Recomendados

1. ✅ Testar todas as funcionalidades
2. 📝 Adicionar seus próprios prompts
3. 🎨 Personalizar cores e estilos
4. 🔐 Implementar autenticação (ver DEVELOPMENT.md)
5. 💾 Adicionar banco de dados (ver DEVELOPMENT.md)
6. ☁️ Configurar upload de imagens real

## 💡 Dicas

- **Performance**: As imagens do Unsplash já estão otimizadas
- **SEO**: Adicione alt text descritivos nas imagens
- **UX**: Sempre forneça feedback visual (loading, success, error)
- **Acessibilidade**: Teste navegação por teclado (Tab, Enter)

## 🐛 Problemas Comuns

### Imagens não carregam

- Verifique se `next.config.ts` tem os domínios configurados
- Reinicie o servidor após modificar `next.config.ts`

### Estilos quebrados

- Limpe o cache: `rm -rf .next`
- Reinstale dependências: `npm install`

### Componentes shadcn não aparecem

- Verifique se instalou o componente: `npx shadcn@latest add [nome]`
- Confira os imports no arquivo

## 📚 Aprendendo Mais

- [Tutorial Next.js](https://nextjs.org/learn)
- [Documentação Tailwind](https://tailwindcss.com/docs)
- [shadcn/ui Gallery](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🤝 Precisa de Ajuda?

- Consulte `DEVELOPMENT.md` para guia completo
- Veja `README.md` para visão geral do projeto
- Explore a documentação das tecnologias usadas

---

**Divirta-se explorando e criando sua comunidade de prompts! 🎉**
