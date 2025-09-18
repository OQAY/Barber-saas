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
  console.log('=== PRISMA CONFIG DEBUG ===')
  console.log('isVercel:', isVercel)
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('VERCEL env var:', process.env.VERCEL)

  if (isVercel) {
    // Vercel usa direct connection para evitar problemas de serverless
    const directUrl = process.env.DIRECT_DATABASE_URL
    console.log('DIRECT_DATABASE_URL exists:', !!directUrl)
    if (!directUrl) {
      console.error('DIRECT_DATABASE_URL is missing in Vercel!')
      // Fallback para DATABASE_URL se DIRECT_DATABASE_URL não existir
      const fallbackUrl = process.env.DATABASE_URL
      if (!fallbackUrl) {
        throw new Error('Neither DIRECT_DATABASE_URL nor DATABASE_URL found for Vercel deployment')
      }
      console.log('Using DATABASE_URL as fallback')
      return fallbackUrl
    }
    console.log('Using DIRECT_DATABASE_URL for Vercel')
    return directUrl
  } else {
    // Desenvolvimento usa pooler para testar comportamento de produção
    const poolerUrl = process.env.DATABASE_URL
    console.log('DATABASE_URL exists:', !!poolerUrl)
    if (!poolerUrl) {
      throw new Error('DATABASE_URL is required for development')
    }
    console.log('Using DATABASE_URL for development')
    return poolerUrl
  }
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