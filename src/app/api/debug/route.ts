import { NextResponse } from 'next/server'
import { getDatabaseUrl } from '@/app/_lib/prisma-config'
import { db } from '@/app/_lib/prisma'

export async function GET() {
  try {
    const debugInfo: any = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        DIRECT_DATABASE_URL_EXISTS: !!process.env.DIRECT_DATABASE_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      },
      database: {
        configuredUrl: 'checking...',
        connectionTest: 'pending...'
      }
    }

    // Teste a configuração do banco
    try {
      const databaseUrl = getDatabaseUrl()
      debugInfo.database.configuredUrl = databaseUrl.substring(0, 50) + '...'
    } catch (error) {
      debugInfo.database.configuredUrl = `ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    // Teste a conexão
    try {
      const result = await db.$queryRaw`SELECT 1 as test`
      debugInfo.database.connectionTest = 'SUCCESS'
    } catch (error) {
      debugInfo.database.connectionTest = `FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    // Teste busca de barbershop
    try {
      const barbershopCount = await db.barbershop.count()
      const barberCount = await db.barber.count()
      debugInfo.database.barbershopCount = barbershopCount
      debugInfo.database.barberCount = barberCount
    } catch (error) {
      debugInfo.database.queryTest = `FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    return NextResponse.json(debugInfo, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}