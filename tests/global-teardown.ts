import { FullConfig } from '@playwright/test'

/**
 * Teardown global para testes E2E
 * Executa após todos os testes
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting E2E test cleanup...')

  // Limpar dados de teste se necessário
  // await cleanupTestData()

  console.log('✅ E2E test cleanup completed')
}

export default globalTeardown