import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "@/app/_lib/prisma";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const { email, password } = validatedData;

    // Buscar usuário por email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Verificar se é usuário do provider email (não Google)
    if (user.provider !== "email") {
      return NextResponse.json(
        { error: "Este email está associado a uma conta Google. Use 'Entrar com Google'" },
        { status: 400 }
      );
    }

    // Verificar se tem senha (usuários Google não têm)
    if (!user.password) {
      return NextResponse.json(
        { error: "Este usuário não possui senha cadastrada" },
        { status: 400 }
      );
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Atualizar último login
    await db.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    });

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name,
        provider: user.provider
      },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Login realizado com sucesso",
        user: userWithoutPassword,
        token,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro no login:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}