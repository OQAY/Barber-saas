"use client"

import { useEffect } from "react"
import { Button } from "./_components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./_components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import { logger } from "./_lib/logger"
import Link from "next/link"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log do erro global
    logger.error("Global application error", error, {
      digest: error.digest,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    })
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl">Algo deu errado!</CardTitle>
          <CardDescription>
            Encontramos um erro inesperado. Nossa equipe foi notificada automaticamente.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isDevelopment && (
            <div className="rounded-lg bg-red-50 p-4">
              <h4 className="mb-2 font-medium text-red-800">
                Informações de Desenvolvimento:
              </h4>
              <pre className="text-xs text-red-700 overflow-auto max-h-32">
                {error.message}
              </pre>
              {error.digest && (
                <p className="mt-2 text-xs text-red-600">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <div className="grid gap-2">
              <Button onClick={reset} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao Início
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Recarregar Página Completa
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Se o problema persistir, tente:</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• Atualizar seu navegador</li>
              <li>• Limpar cache e cookies</li>
              <li>• Entrar em contato com o suporte</li>
            </ul>
          </div>

          {error.digest && !isDevelopment && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Código do erro: <code className="text-red-600">{error.digest}</code>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Informe este código ao entrar em contato com o suporte.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}