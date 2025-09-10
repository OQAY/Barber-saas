import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "@/app/_lib/prisma";

const registerSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const { firstName, lastName, email, phone, password } = validatedData;

    // Verificar se email já existe
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    // Verificar se telefone já existe
    const existingUserByPhone = await db.user.findFirst({
      where: { phone },
    });

    if (existingUserByPhone) {
      return NextResponse.json(
        { error: "Este telefone já está cadastrado" },
        { status: 400 }
      );
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        password: hashedPassword,
        provider: "email",
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        user: userWithoutPassword,
        token,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erro no registro:", error);

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