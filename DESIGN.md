# 🎨 Características Visuais - PromptShare

## 🌟 Design e Interface

### Tema
- **Estilo**: Moderno e minimalista
- **Cores**: Sistema de cores neutro com acentos
- **Tipografia**: Geist Sans (clean e legível)
- **Responsivo**: Mobile-first design

### Layout Principal

```
┌─────────────────────────────────────────────────┐
│  ✨ PromptShare    🔍 [Buscar...]   [+ Compartilhar]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Explore Prompts da Comunidade                  │
│  Descubra e compartilhe prompts incríveis...    │
│                                                 │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐           │
│  │  🖼️  │  │  🖼️  │  │  🖼️  │  │  🖼️  │           │
│  │Card │  │Card │  │Card │  │Card │           │
│  └─────┘  └─────┘  └─────┘  └─────┘           │
│                                                 │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐           │
│  │  🖼️  │  │  🖼️  │  │  🖼️  │  │  🖼️  │           │
│  │Card │  │Card │  │Card │  │Card │           │
│  └─────┘  └─────┘  └─────┘  └─────┘           │
│                                                 │
├─────────────────────────────────────────────────┤
│  © 2024 PromptShare - Comunidade de Prompts    │
└─────────────────────────────────────────────────┘
```

## 🎴 Estrutura do Card

Cada card de prompt contém:

```
┌─────────────────────────┐
│                         │
│      [IMAGEM]           │
│                         │
├─────────────────────────┤
│ 👤 Nome do Autor        │
│                         │
│ Título do Prompt        │
│                         │
│ Texto do prompt         │
│ truncado em 3 linhas... │
│                         │
│ [tag1] [tag2] [tag3]    │
│                         │
├─────────────────────────┤
│ ❤️ 142    [Copiar Prompt]│
└─────────────────────────┘
```

### Interações do Card

1. **Hover**: Sombra aumenta (efeito de elevação)
2. **Botão Like**: 
   - Inativo: Ícone vazio
   - Ativo: Ícone preenchido + vermelho
3. **Botão Copiar**: 
   - Normal: "Copiar Prompt"
   - Copiado: "Copiado!" com ícone de check (2s)

## 📤 Dialog de Upload

```
┌───────────────────────────────────┐
│  Compartilhar Novo Prompt         │
│  Compartilhe sua imagem e o...    │
├───────────────────────────────────┤
│                                   │
│  Imagem                           │
│  [Escolher arquivo]               │
│  ┌─────────────────────┐         │
│  │   [Preview da       │         │
│  │    Imagem]          │         │
│  └─────────────────────┘         │
│                                   │
│  Título                           │
│  [________________]               │
│                                   │
│  Prompt                           │
│  [________________]               │
│  [________________]               │
│  [________________]               │
│                                   │
│  Tags (separadas por vírgula)     │
│  [________________]               │
│                                   │
│        [Cancelar]  [📤 Publicar]  │
└───────────────────────────────────┘
```

## 🎯 Estados de Interação

### Loading States
- Cards podem ter skeleton loaders
- Botões mostram spinner quando processando

### Empty States
```
┌─────────────────────────────────┐
│                                 │
│         🔍                       │
│                                 │
│  Nenhum prompt encontrado.      │
│  Tente outra busca!             │
│                                 │
└─────────────────────────────────┘
```

### Success States
- Notificação ao copiar prompt
- Feedback visual ao curtir
- Confirmação ao publicar

## 📱 Breakpoints Responsivos

### Mobile (< 640px)
- 1 coluna de cards
- Header empilhado verticalmente
- Busca em largura total

### Tablet (640px - 1024px)
- 2 colunas de cards
- Header com busca centralizada

### Desktop (1024px - 1280px)
- 3 colunas de cards
- Layout completo

### Large Desktop (> 1280px)
- 4 colunas de cards
- Máxima utilização do espaço

## 🎨 Paleta de Cores (Light Mode)

```css
Background:      #FFFFFF (branco)
Foreground:      #18181B (quase preto)
Primary:         #18181B (botões principais)
Secondary:       #F4F4F5 (backgrounds secundários)
Muted:           #F4F4F5 (textos menos importantes)
Border:          #E4E4E7 (bordas sutis)
Accent:          Definido no tema
```

## 🌙 Dark Mode (Suportado)

O tema escuro é automaticamente aplicado baseado nas preferências do sistema:

```css
Background:      #18181B (quase preto)
Foreground:      #FAFAFA (quase branco)
Primary:         #E4E4E7 (botões principais)
Card:            #27272A (cards levemente mais claros)
Border:          rgba(255,255,255,0.1) (bordas sutis)
```

## ✨ Animações e Transições

### Hover Effects
- Cards: `transition-shadow duration-300`
- Botões: `transition-colors duration-200`
- Imagens: Efeito de zoom suave

### Click Feedback
- Ripple effect nos botões
- Mudança de cor instantânea
- Escala ligeira no press

### Page Transitions
- Fade in ao carregar
- Smooth scroll
- Animações de entrada dos cards

## 🔍 Acessibilidade

### Keyboard Navigation
- Tab: Navegar entre elementos
- Enter: Ativar botões/links
- Esc: Fechar dialogs

### Screen Readers
- Alt text em todas as imagens
- Labels descritivos
- ARIA attributes apropriados

### Contrast
- Ratios WCAG AA compliant
- Textos legíveis em ambos os temas

## 💫 Micro-interações

1. **Like Button**
   - Animação de "pulso" ao curtir
   - Contador incrementa com fade

2. **Copy Button**
   - Mudança de ícone com transição
   - Tooltip com feedback

3. **Search Bar**
   - Ícone de busca animado
   - Clear button aparece quando há texto

4. **Upload Progress**
   - Preview da imagem com fade in
   - Loading state durante upload

## 🎭 Componentes Reutilizáveis

Todos os componentes UI são do shadcn/ui, customizáveis via:
- `src/components/ui/` - Componentes base
- `src/app/globals.css` - Variáveis de tema
- Tailwind classes - Estilização inline

## 🖼️ Otimizações de Imagem

- Next.js Image component
- Lazy loading automático
- Blur placeholder
- Responsive sizes
- WebP formato quando disponível

---

**O design prioriza clareza, performance e experiência do usuário! 🎨**
