import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

async function createDemoUser() {
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    max: 1,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("🔧 Criando usuário demo...");

    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { id: "demo-user-id" },
    });

    if (existing) {
      console.log("✅ Usuário demo já existe!");
      return;
    }

    // Criar usuário demo
    const user = await prisma.user.create({
      data: {
        id: "demo-user-id",
        email: "demo@promptshare.com",
        username: "demo_user",
        name: "Usuário Demo",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        bio: "Usuário de demonstração do sistema",
      },
    });

    console.log("✅ Usuário demo criado:", user.username);
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

createDemoUser();
