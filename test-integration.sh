#!/bin/bash

echo "🧪 Testando integração Frontend + Backend..."
echo ""

# Test 1: API Endpoint
echo "1️⃣ Testando API /api/posts..."
API_RESPONSE=$(curl -s http://localhost:3000/api/posts)
if echo "$API_RESPONSE" | grep -q "Paisagem Cyberpunk"; then
    echo "   ✅ API retornando dados corretos"
else
    echo "   ❌ API com problema"
fi
echo ""

# Test 2: Contar posts
POST_COUNT=$(echo "$API_RESPONSE" | grep -o '"id":' | wc -l)
echo "2️⃣ Número de posts na API: $POST_COUNT"
echo ""

# Test 3: Verificar estrutura do post
echo "3️⃣ Estrutura do primeiro post:"
echo "$API_RESPONSE" | head -c 500
echo ""
echo ""

echo "✅ Testes concluídos!"
echo ""
echo "🌐 Abra http://localhost:3000 no navegador para ver a página"
