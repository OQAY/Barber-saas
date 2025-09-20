"use client"

import React, { Component, ReactNode } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { logger } from "../../_lib/logger"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorId?: string
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Gera um ID único para o erro
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log do erro
    logger.error("React Error Boundary caught an error", error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
      errorId: this.state.errorId,
      props: this.props
    })

    // Callback personalizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar com Sentry, LogRocket, etc.
      console.error('Error caught by boundary:', {
        error: error.message,
        stack: error.stack,
        errorId: this.state.errorId
      })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Fallback customizado
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Fallback padrão
      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-lg">Oops! Algo deu errado</CardTitle>
              <CardDescription>
                Encontramos um erro inesperado. Nossa equipe foi notificada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="rounded bg-red-50 p-3 text-sm">
                  <p className="font-medium text-red-800">Erro de Desenvolvimento:</p>
                  <p className="text-red-700">{this.state.error.message}</p>
                  {this.state.errorId && (
                    <p className="mt-1 text-xs text-red-600">ID: {this.state.errorId}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={this.handleRetry}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar Novamente
                </Button>
                <Button
                  onClick={this.handleReload}
                  className="flex-1"
                >
                  Recarregar Página
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Se o problema persistir, entre em contato com o suporte.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para usar error boundary programaticamente
export function useErrorHandler() {
  return (error: Error, errorInfo?: string) => {
    logger.error("Manual error reported", error, { context: errorInfo })

    // Em produção, pode mostrar um toast ou modal de erro
    if (process.env.NODE_ENV === 'production') {
      // TODO: Mostrar notificação de erro para o usuário
      console.error('Manual error:', error.message)
    } else {
      // Em desenvolvimento, re-throw para ser capturado pelo DevTools
      throw error
    }
  }
}

// Error Boundary específico para booking
export function BookingErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error("Booking component error", error, {
          componentStack: errorInfo.componentStack,
          context: "booking_flow"
        })
      }}
      fallback={
        <Card className="p-6 text-center">
          <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-orange-500" />
          <h3 className="mb-2 font-semibold">Erro no Agendamento</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Não foi possível carregar o sistema de agendamento.
          </p>
          <Button onClick={() => window.location.reload()}>
            Recarregar
          </Button>
        </Card>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

// Error Boundary específico para dashboard administrativo
export function AdminErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error("Admin dashboard error", error, {
          componentStack: errorInfo.componentStack,
          context: "admin_dashboard"
        })
      }}
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Card className="p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h2 className="mb-2 text-xl font-bold">Erro no Dashboard</h2>
            <p className="mb-4 text-muted-foreground">
              O painel administrativo encontrou um erro.
            </p>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => window.history.back()}>
                Voltar
              </Button>
              <Button onClick={() => window.location.reload()}>
                Recarregar Dashboard
              </Button>
            </div>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}