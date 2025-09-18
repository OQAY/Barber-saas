import { PrismaClient } from "@prisma/client"
import { getDatabaseUrl, getLogLevel } from "./prisma-config"

declare global {
  // eslint-disable-next-line no-unused-vars
  var cachedPrisma: PrismaClient
}

/**
 * Cria nova instância do Prisma com configuração otimizada para o ambiente
 */
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: getLogLevel(),
    datasources: {
      db: {
        url: getDatabaseUrl()
      }
    }
  })
}

let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  // Produção: nova instância sempre (serverless)
  prisma = createPrismaClient()
} else {
  // Desenvolvimento: reutiliza instância global
  if (!global.cachedPrisma) {
    global.cachedPrisma = createPrismaClient()
  }
  prisma = global.cachedPrisma
}

export const db = prisma
