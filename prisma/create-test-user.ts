import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash("test123", 10)
    
    // Criar usuário de teste
    const user = await prisma.user.create({
      data: {
        email: "test@test.com",
        name: "Test User",
        firstName: "Test",
        lastName: "User",
        password: hashedPassword,
        provider: "email",
        isVerified: true,
        role: "USER"
      }
    })
    
    console.log("✅ Usuário de teste criado com sucesso!")
    console.log("Email: test@test.com")
    console.log("Senha: test123")
    console.log("ID:", user.id)
    
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log("⚠️ Usuário test@test.com já existe no banco de dados")
    } else {
      console.error("❌ Erro ao criar usuário:", error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()