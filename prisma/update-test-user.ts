import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function updateTestUser() {
  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash("test123", 10)
    
    // Atualizar usuário de teste
    const user = await prisma.user.update({
      where: { email: "test@test.com" },
      data: {
        name: "Test User",
        firstName: "Test",
        lastName: "User",
        password: hashedPassword,
        provider: "email",
        isVerified: true,
        role: "USER"
      }
    })
    
    console.log("✅ Usuário de teste atualizado com sucesso!")
    console.log("Email: test@test.com")
    console.log("Senha: test123")
    console.log("Provider:", user.provider)
    
  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error)
  } finally {
    await prisma.$disconnect()
  }
}

updateTestUser()