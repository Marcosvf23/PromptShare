# 📊 Diagrama do Banco de Dados

## Relacionamentos das Tabelas

```
┌──────────────┐
│     User     │
├──────────────┤
│ id (PK)      │◄────────┐
│ email        │         │
│ username     │         │
│ name         │         │
│ avatarUrl    │         │
│ bio          │         │
│ createdAt    │         │
│ updatedAt    │         │
└──────────────┘         │
       │                 │
       │ 1:N             │
       │                 │
       ▼                 │
┌──────────────┐         │
│     Post     │         │
├──────────────┤         │
│ id (PK)      │◄────────┼──────┐
│ title        │         │      │
│ prompt       │         │      │
│ negativePrompt        │      │
│ imageUrl     │         │      │
│ thumbnailUrl │         │      │
│ width        │         │      │
│ height       │         │      │
│ model        │         │      │
│ steps        │         │      │
│ seed         │         │      │
│ cfgScale     │         │      │
│ sampler      │         │      │
│ userId (FK)  │─────────┘      │
│ viewCount    │                │
│ likeCount    │                │
│ commentCount │                │
│ published    │                │
│ featured     │                │
│ createdAt    │                │
│ updatedAt    │                │
└──────────────┘                │
       │                        │
       │ N:M                    │
       │                        │
       ▼                        │
┌──────────────┐                │
│   PostTag    │                │
├──────────────┤                │
│ postId (FK)  │────────────────┘
│ tagId (FK)   │─────┐
└──────────────┘     │
                     │
                     ▼
              ┌──────────────┐
              │     Tag      │
              ├──────────────┤
              │ id (PK)      │
              │ name         │
              │ slug (UQ)    │
              │ postCount    │
              │ createdAt    │
              └──────────────┘

┌──────────────┐         ┌──────────────┐
│     Like     │         │   Comment    │
├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │
│ userId (FK)  │─────────│ content      │
│ postId (FK)  │─┐       │ userId (FK)  │
│ createdAt    │ │       │ postId (FK)  │
└──────────────┘ │       │ parentId (FK)│◄─┐
                 │       │ createdAt    │  │
                 │       │ updatedAt    │  │
                 │       └──────────────┘  │
                 │              │          │
                 │              └──────────┘
                 │              Self-referencing
                 │
                 └────────►┌──────────────┐
                          │     Post     │
                          └──────────────┘

┌──────────────┐         ┌──────────────┐
│   Follows    │         │     User     │
├──────────────┤         └──────────────┘
│ followerId(FK)─────────►      ▲
│ followingId(FK)────────────────┘
│ createdAt    │
└──────────────┘

┌──────────────┐         ┌──────────────────┐
│  Collection  │         │ CollectionPost   │
├──────────────┤         ├──────────────────┤
│ id (PK)      │◄────────│ collectionId (FK)│
│ name         │         │ postId (FK)      │
│ description  │         │ addedAt          │
│ isPublic     │         └──────────────────┘
│ userId (FK)  │
│ createdAt    │
│ updatedAt    │
└──────────────┘
```

## Cardinalidade

### User

- **1 User** : **N Posts** (Um usuário pode criar vários posts)
- **1 User** : **N Likes** (Um usuário pode curtir vários posts)
- **1 User** : **N Comments** (Um usuário pode fazer vários comentários)
- **N User** : **N User** (Usuários podem seguir vários usuários - Follows)

### Post

- **1 Post** : **1 User** (Um post pertence a um usuário)
- **1 Post** : **N Tags** (Um post pode ter várias tags)
- **1 Post** : **N Likes** (Um post pode ter várias curtidas)
- **1 Post** : **N Comments** (Um post pode ter vários comentários)

### Tag

- **1 Tag** : **N Posts** (Uma tag pode estar em vários posts)

### Comment

- **1 Comment** : **N Comments** (Respostas aninhadas)
- **1 Comment** : **1 User** (Um comentário pertence a um usuário)
- **1 Comment** : **1 Post** (Um comentário pertence a um post)

### Collection

- **1 Collection** : **N Posts** (Uma coleção pode ter vários posts)
- **1 Collection** : **1 User** (Uma coleção pertence a um usuário)

## Índices Criados

Para otimização de queries:

### User

- `username` (único, para perfis)
- `email` (único, para login)

### Post

- `userId` (para listar posts de um usuário)
- `createdAt` (para ordenação cronológica)
- `likeCount` (para posts mais curtidos)
- `featured` (para posts em destaque)

### Tag

- `slug` (único, para URLs amigáveis)
- `postCount` (para tags populares)

### PostTag

- `postId` (para encontrar tags de um post)
- `tagId` (para encontrar posts de uma tag)

### Like

- `userId` (para likes de um usuário)
- `postId` (para likes de um post)
- `userId_postId` (único, um usuário só pode curtir uma vez)

### Comment

- `userId` (para comentários de um usuário)
- `postId` (para comentários de um post)
- `parentId` (para respostas)
- `createdAt` (para ordenação)

### Follows

- `followerId` (para quem o usuário segue)
- `followingId` (para seguidores de um usuário)

## Constraints

### Unique

- `User.email`
- `User.username`
- `Tag.name`
- `Tag.slug`
- `Like.userId + postId` (um usuário só pode curtir uma vez)

### Cascade Delete

Quando deletar:

- **User** → Deleta todos os Posts, Likes, Comments, Follows, Collections
- **Post** → Deleta todos os PostTags, Likes, Comments, CollectionPosts
- **Tag** → Deleta todos os PostTags
- **Comment** → Deleta todas as respostas (Comments filhos)

## Campos Especiais

### Timestamps

Todas as tabelas têm:

- `createdAt` - Data de criação
- `updatedAt` (onde aplicável) - Data da última atualização

### Contadores Desnormalizados

Para performance (evitar COUNT queries):

- `Post.viewCount` - Número de visualizações
- `Post.likeCount` - Número de likes
- `Post.commentCount` - Número de comentários
- `Tag.postCount` - Número de posts com esta tag

### Campos Técnicos (Post)

Para reproduzir geração de imagem:

- `model` - Modelo de IA usado (ex: "Midjourney v6")
- `steps` - Número de steps
- `seed` - Seed para reprodução
- `cfgScale` - CFG Scale
- `sampler` - Sampler usado

## Queries Comuns

### 1. Listar posts recentes com dados do autor

```prisma
post.findMany({
  include: {
    user: { select: { id, username, name, avatarUrl } },
    tags: { include: { tag: true } },
    _count: { select: { likes: true, comments: true } }
  },
  orderBy: { createdAt: 'desc' },
  take: 12
})
```

### 2. Buscar posts por tag

```prisma
post.findMany({
  where: {
    tags: {
      some: {
        tag: { slug: 'cyberpunk' }
      }
    }
  }
})
```

### 3. Posts de um usuário com estatísticas

```prisma
user.findUnique({
  where: { id: userId },
  include: {
    posts: {
      include: {
        _count: { select: { likes: true, comments: true } }
      }
    },
    _count: {
      select: {
        posts: true,
        likes: true,
        followers: true,
        following: true
      }
    }
  }
})
```

### 4. Verificar se usuário curtiu post

```prisma
like.findUnique({
  where: {
    userId_postId: {
      userId: userId,
      postId: postId
    }
  }
})
```

### 5. Comentários com respostas

```prisma
comment.findMany({
  where: { postId: postId, parentId: null },
  include: {
    user: { select: { id, username, name, avatarUrl } },
    replies: {
      include: {
        user: { select: { id, username, name, avatarUrl } }
      }
    }
  },
  orderBy: { createdAt: 'asc' }
})
```

## Performance Tips

1. **Use índices** - Todos os campos usados em WHERE/ORDER BY devem ter índices
2. **Selecione apenas campos necessários** - Use `select` em vez de incluir tudo
3. **Use `_count`** - Para contagens, use o contador virtual do Prisma
4. **Paginação** - Sempre use `skip` e `take` para limitar resultados
5. **Evite N+1** - Use `include` para eager loading de relações

## Escalabilidade

Para grandes volumes:

- Considere particionamento por data (Posts antigos em tabelas separadas)
- Cache de queries frequentes (Redis)
- Read replicas para queries pesadas
- Índices parciais para queries específicas
- Materialized views para agregações complexas
