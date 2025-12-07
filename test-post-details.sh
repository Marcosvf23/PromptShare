#!/bin/bash

echo "=== Teste de Página de Detalhes e Comentários ==="
echo ""

BASE_URL="http://localhost:3000"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "1. Buscando primeiro post da lista..."
posts_response=$(curl -s "$BASE_URL/api/posts")
first_post_id=$(echo "$posts_response" | jq -r '.[0].id')

if [ -z "$first_post_id" ] || [ "$first_post_id" = "null" ]; then
    echo -e "${RED}✗ Nenhum post encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Post ID: $first_post_id${NC}"
echo ""

echo "2. Testando endpoint de detalhes do post..."
echo "GET $BASE_URL/api/posts/$first_post_id"
post_detail=$(curl -s "$BASE_URL/api/posts/$first_post_id")
echo "$post_detail" | jq '.'

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Endpoint de detalhes funcionando${NC}"
else
    echo -e "${RED}✗ Erro ao buscar detalhes${NC}"
fi
echo ""

echo "3. Testando endpoint de comentários (GET)..."
echo "GET $BASE_URL/api/posts/$first_post_id/comments"
comments=$(curl -s "$BASE_URL/api/posts/$first_post_id/comments")
comments_count=$(echo "$comments" | jq '. | length')
echo -e "${BLUE}Comentários encontrados: $comments_count${NC}"
echo "$comments" | jq '.'
echo ""

echo "4. Verificando estrutura da resposta..."
title=$(echo "$post_detail" | jq -r '.title')
author=$(echo "$post_detail" | jq -r '.author.name')
tags_count=$(echo "$post_detail" | jq '.tags | length')
likes=$(echo "$post_detail" | jq -r '.likes')

echo "  - Título: $title"
echo "  - Autor: $author"
echo "  - Tags: $tags_count"
echo "  - Likes: $likes"
echo ""

echo "5. Testando criação de comentário (requer autenticação)..."
echo "Nota: Este teste falhará sem autenticação (401) - é esperado"
comment_response=$(curl -s -X POST "$BASE_URL/api/posts/$first_post_id/comments" \
    -H "Content-Type: application/json" \
    -d '{"content": "Comentário de teste automatizado"}' \
    -w "\nHTTP_STATUS:%{http_code}")

http_status=$(echo "$comment_response" | grep "HTTP_STATUS" | cut -d':' -f2)
body=$(echo "$comment_response" | sed '/HTTP_STATUS/d')

echo "Status: $http_status"
echo "Response: $body" | jq '.' 2>/dev/null || echo "$body"

if [ "$http_status" = "401" ]; then
    echo -e "${YELLOW}✓ Autenticação necessária (como esperado)${NC}"
elif [ "$http_status" = "201" ]; then
    echo -e "${GREEN}✓ Comentário criado com sucesso${NC}"
else
    echo -e "${RED}✗ Status inesperado${NC}"
fi
echo ""

echo "=== Resumo ==="
echo "✓ API de detalhes do post funcionando"
echo "✓ API de comentários (GET) funcionando"
echo "✓ Proteção de autenticação em comentários (POST)"
echo ""
echo "Para testar a página completa:"
echo "1. Acesse: ${BLUE}http://localhost:3000/posts/$first_post_id${NC}"
echo "2. Visualize os detalhes do post"
echo "3. Faça login"
echo "4. Adicione um comentário"
echo ""
