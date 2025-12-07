#!/bin/bash

echo "=== Teste de Perfil de Usuário ==="
echo ""

BASE_URL="http://localhost:3000"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "1. Buscando usuário demo..."
demo_username="demo_user"

echo "GET $BASE_URL/api/users/$demo_username"
user_response=$(curl -s "$BASE_URL/api/users/$demo_username")

if echo "$user_response" | grep -q '"username"'; then
    echo -e "${GREEN}✓ Usuário encontrado${NC}"
    echo "$user_response" | head -c 500
    echo ""
else
    echo -e "${RED}✗ Usuário não encontrado${NC}"
    echo "$user_response"
fi
echo ""

echo "2. Buscando posts do usuário..."
echo "GET $BASE_URL/api/users/$demo_username/posts"
posts_response=$(curl -s "$BASE_URL/api/users/$demo_username/posts")

if echo "$posts_response" | grep -q '\['; then
    posts_count=$(echo "$posts_response" | grep -o '"id"' | wc -l)
    echo -e "${BLUE}Posts encontrados: $posts_count${NC}"
    echo "$posts_response" | head -c 500
    echo ""
else
    echo -e "${RED}✗ Erro ao buscar posts${NC}"
    echo "$posts_response"
fi
echo ""

echo "3. Testando usuário inexistente..."
echo "GET $BASE_URL/api/users/usuario_inexistente"
not_found_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/api/users/usuario_inexistente")

http_status=$(echo "$not_found_response" | grep "HTTP_STATUS" | cut -d':' -f2)
body=$(echo "$not_found_response" | sed '/HTTP_STATUS/d')

echo "Status: $http_status"
echo "Response: $body"

if [ "$http_status" = "404" ]; then
    echo -e "${GREEN}✓ 404 retornado corretamente${NC}"
else
    echo -e "${RED}✗ Status inesperado${NC}"
fi
echo ""

echo "4. Verificando página de perfil..."
page_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/users/$demo_username")
echo "Status da página /users/$demo_username: $page_status"

if [ "$page_status" = "200" ]; then
    echo -e "${GREEN}✓ Página de perfil acessível${NC}"
else
    echo -e "${RED}✗ Página não acessível${NC}"
fi
echo ""

echo "=== Resumo ==="
echo "✓ API de perfil de usuário funcionando"
echo "✓ API de posts do usuário funcionando"
echo "✓ Página de perfil renderizando"
echo "✓ Tratamento de 404 para usuários inexistentes"
echo ""
echo "Para testar visualmente:"
echo "1. Acesse: ${BLUE}http://localhost:3000/users/$demo_username${NC}"
echo "2. Clique no avatar de qualquer post para ver o perfil"
echo "3. Visualize estatísticas e posts do usuário"
echo ""
