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
  // SIMPLIFICADO: Sempre usar DATABASE_URL (pooler)
  // O pooler funciona tanto em dev quanto em produção
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  console.log('Using DATABASE_URL (pooler) for all environments')
  return databaseUrl
}

/**
 * Log level baseado no ambiente
 */
export const getLogLevel = (): ('query' | 'info' | 'warn' | 'error')[] => {
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