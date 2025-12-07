import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schema de validação
const updateProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  username: z
    .string()
    .min(3, "Username deve ter no mínimo 3 caracteres")
    .max(20, "Username deve ter no máximo 20 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Username deve conter apenas letras, números e _")
    .optional(),
  bio: z.string().max(500, "Bio muito longa").optional(),
  avatarUrl: z.string().url("URL de avatar inválida").optional().or(z.literal("")),
});

// GET /api/profile - Obter perfil do usuário autenticado
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Atualizar perfil do usuário
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validar dados
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Dados inválidos", 
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const { name, username, bio, avatarUrl } = validation.data;

    // Verificar se username já existe (se estiver sendo alterado)
    if (username) {
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { username: true },
      });

      // Só verificar se o username está sendo alterado
      if (currentUser?.username !== username) {
        const existingUser = await prisma.user.findUnique({
          where: { username },
        });

        if (existingUser) {
          return NextResponse.json(
            { error: "Username já está em uso" },
            { status: 409 }
          );
        }
      }
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        username,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Perfil atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
