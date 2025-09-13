import { db } from "../app/_lib/prisma"
import bcrypt from "bcryptjs"

async function createAdminUser() {
  try {
    const email = "admin@fswbarber.com"
    const password = "admin123"
    
    // Verificar se o usuário já existe
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Atualizar para OWNER se já existe
      const updatedUser = await db.user.update({
        where: { email },
        data: { 
          role: "OWNER",
          password: await bcrypt.hash(password, 10)
        }
      })
      console.log("✅ Usuário admin atualizado:", updatedUser.email)
    } else {
      // Criar novo usuário admin
      const hashedPassword = await bcrypt.hash(password, 10)
      
      const adminUser = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name: "Administrador",
          role: "OWNER",
          provider: "credentials",
          isVerified: true
        }
      })
      
      console.log("✅ Usuário admin criado com sucesso!")
      console.log("📧 Email:", adminUser.email)
      console.log("🔑 Senha:", password)
      console.log("👤 Role:", adminUser.role)
    }
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin:", error)
  } finally {
    await db.$disconnect()
  }
}

createAdminUser()