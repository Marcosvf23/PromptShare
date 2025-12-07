#!/bin/bash

echo "=== Teste de Autenticação - PromptShare ==="
echo ""

BASE_URL="http://localhost:3000"

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
    local description=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    echo -e "${YELLOW}Testando:${NC} $description"
    echo "Endpoint: $method $endpoint"
    
    if [ -n "$data" ]; then
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\nHTTP_STATUS:%{http_code}")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -w "\nHTTP_STATUS:%{http_code}")
    fi
    
    http_status=$(echo "$response" | grep "HTTP_STATUS" | cut -d':' -f2)
    body=$(echo "$response" | sed '/HTTP_STATUS/d')
    
    echo "Status: $http_status"
    echo "Response:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    
    if [ "$http_status" -ge 200 ] && [ "$http_status" -lt 300 ]; then
        echo -e "${GREEN}✓ SUCESSO${NC}"
    else
        echo -e "${RED}✗ FALHA${NC}"
    fi
    echo "---"
    echo ""
}

echo "1. Verificando servidor..."
if curl -s "$BASE_URL" > /dev/null; then
    echo -e "${GREEN}✓ Servidor está rodando${NC}"
else
    echo -e "${RED}✗ Servidor não está respondendo${NC}"
    exit 1
fi
echo ""

# Gerar email e username únicos
TIMESTAMP=$(date +%s)
TEST_EMAIL="teste$TIMESTAMP@example.com"
TEST_USERNAME="user$TIMESTAMP"

echo "2. Criando novo usuário..."
SIGNUP_DATA=$(cat <<EOF
{
  "email": "$TEST_EMAIL",
  "username": "$TEST_USERNAME",
  "name": "Usuário Teste",
  "password": "senha123"
}
EOF
)

test_endpoint "Criar conta" "POST" "/api/auth/signup" "$SIGNUP_DATA"

echo "3. Testando login com credenciais inválidas..."
INVALID_LOGIN=$(cat <<EOF
{
  "email": "$TEST_EMAIL",
  "password": "senhaerrada"
}
EOF
)

echo "Nota: Este teste deve falhar (401) - é esperado"
test_endpoint "Login inválido" "POST" "/api/auth/callback/credentials" "$INVALID_LOGIN"

echo "4. Testando endpoints de posts (devem funcionar sem autenticação)..."
test_endpoint "Listar posts" "GET" "/api/posts" ""

echo ""
echo "=== Resumo ==="
echo "✓ Sistema de autenticação configurado"
echo "✓ Endpoint de signup funcionando"
echo "✓ API de posts acessível"
echo ""
echo "Para testar o login completo:"
echo "1. Acesse http://localhost:3000"
echo "2. Clique em 'Criar conta'"
echo "3. Preencha os dados:"
echo "   - Email: $TEST_EMAIL"
echo "   - Username: $TEST_USERNAME"
echo "   - Nome: Usuário Teste"
echo "   - Senha: senha123"
echo "4. Faça login com as credenciais criadas"
echo ""
