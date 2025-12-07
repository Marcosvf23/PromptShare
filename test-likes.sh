#!/bin/bash

echo "🧪 Testando Sistema de Likes"
echo "=============================="
echo ""

# Configuração
POST_ID="cmiv9tbdl000fo6ut4agmyyyf"
USER_ID="demo-user-id"
API_URL="http://localhost:3000/api/posts"

# Teste 1: Ver estado inicial
echo "1️⃣ Estado inicial do post:"
curl -s "$API_URL" | grep -A 2 "$POST_ID" | grep -o '"likes":[0-9]*' || echo "Erro ao buscar"
echo ""

# Teste 2: Dar like
echo "2️⃣ Dando like..."
RESULT=$(curl -s -X POST "$API_URL/$POST_ID/like" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_ID\"}")
echo "   Resultado: $RESULT"
echo ""

# Teste 3: Verificar se like foi registrado
echo "3️⃣ Verificando like registrado..."
LIKE_CHECK=$(curl -s "$API_URL/$POST_ID/like?userId=$USER_ID")
echo "   Status: $LIKE_CHECK"
echo ""

# Teste 4: Remover like (unlike)
echo "4️⃣ Removendo like..."
RESULT=$(curl -s -X POST "$API_URL/$POST_ID/like" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_ID\"}")
echo "   Resultado: $RESULT"
echo ""

# Teste 5: Verificar estado final
echo "5️⃣ Estado final:"
curl -s "$API_URL/$POST_ID/like?userId=$USER_ID"
echo ""
echo ""

echo "✅ Testes concluídos!"
echo ""
echo "🌐 Abra http://localhost:3000 e clique nos corações para testar!"
