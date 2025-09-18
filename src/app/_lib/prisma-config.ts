/**
 * Configuração condicional do Prisma para diferentes ambientes
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isVercel = process.env.VERCEL === '1'

/**
 * Retorna a URL correta do banco baseada no ambiente:
 * - Vercel: Direct connection (5432) - sem pooler, evita prepared statement issues
 * - Development: Pooler connection (6543) - com pooler para simular produção
 */
export function getDatabaseUrl(): string {
  if (isVercel) {
    // Vercel usa direct connection para evitar problemas de serverless
    const directUrl = process.env.DIRECT_DATABASE_URL
    if (!directUrl) {
      throw new Error('DIRECT_DATABASE_URL is required for Vercel deployment')
    }
    return directUrl
  } else {
    // Desenvolvimento usa pooler para testar comportamento de produção
    const poolerUrl = process.env.DATABASE_URL
    if (!poolerUrl) {
      throw new Error('DATABASE_URL is required for development')
    }
    return poolerUrl
  }
}

/**
 * Log level baseado no ambiente
 */
export const getLogLevel = () => {
  if (isDevelopment) {
    return ['query', 'error', 'warn']
  }
  return ['error']
}

/**
 * Configurações de conexão otimizadas para cada ambiente
 */
export const getConnectionConfig = () => {
  return {
    // Timeout mais baixo para serverless
    connectTimeout: isVercel ? 5000 : 10000,
    // Pool menor para serverless
    connectionLimit: isVercel ? 1 : 5,
  }
}