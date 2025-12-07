#!/bin/bash

echo "🧪 Testando Sistema de Upload de Posts"
echo "========================================"
echo ""

API_URL="http://localhost:3000/api/posts"

# Teste 1: Criar novo post
echo "1️⃣ Criando novo post..."
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste Automatizado",
    "prompt": "A cyberpunk cityscape with neon lights, futuristic, highly detailed",
    "imageUrl": "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800",
    "model": "Midjourney v6",
    "tags": ["cyberpunk", "teste", "automacao"],
    "userId": "demo-user-id"
  }')

# Extrair ID do post
POST_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$POST_ID" ]; then
  echo "   ✅ Post criado com ID: $POST_ID"
else
  echo "   ❌ Falha ao criar post"
  exit 1
fi
echo ""

# Teste 2: Verificar post na lista
echo "2️⃣ Verificando se post aparece na lista..."
COUNT=$(curl -s "$API_URL" | grep -c "$POST_ID")
if [ "$COUNT" -gt 0 ]; then
  echo "   ✅ Post encontrado na lista"
else
  echo "   ❌ Post não encontrado"
fi
echo ""

# Teste 3: Verificar tags criadas
echo "3️⃣ Verificando tags..."
TAGS=$(echo "$RESPONSE" | grep -o '"tags":\[.*\]' | head -1)
echo "   Tags: $TAGS"
echo ""

# Teste 4: Contar total de posts
echo "4️⃣ Total de posts no banco:"
TOTAL=$(curl -s "$API_URL" | grep -o '"id":"' | wc -l)
echo "   Total: $TOTAL posts"
echo ""

# Teste 5: Validação - tentar criar sem campos obrigatórios
echo "5️⃣ Testando validação (sem título)..."
ERROR_RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Test prompt",
    "imageUrl": "https://example.com/image.jpg",
    "userId": "demo-user-id"
  }')

if echo "$ERROR_RESPONSE" | grep -q "error"; then
  echo "   ✅ Validação funcionando corretamente"
else
  echo "   ❌ Validação não está funcionando"
fi
echo ""

echo "✅ Testes concluídos!"
echo ""
echo "🌐 Abra http://localhost:3000 para ver os posts!"
echo "📝 Clique em 'Compartilhar Prompt' para testar o upload!"
