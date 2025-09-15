"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import { PlayCircle, CheckCircle2, XCircle, UserX, Clock, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { updateBookingStatus, updateExpiredBookings } from "@/app/_actions/update-booking-status"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select"

interface Booking {
  id: string
  date: Date
  status: string
  user: {
    name: string | null
  }
  service: {
    name: string
  }
  barber: {
    name: string
  }
}

interface QuickActionsProps {
  bookings: Booking[]
}

export default function QuickActions({ bookings }: QuickActionsProps) {
  const [selectedBookingId, setSelectedBookingId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  // Atualiza automaticamente agendamentos expirados a cada minuto
  useEffect(() => {
    const updateExpired = async () => {
      await updateExpiredBookings()
    }

    // Executa imediatamente ao carregar
    updateExpired()

    // Configura intervalo para executar a cada minuto
    const interval = setInterval(updateExpired, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleStatusUpdate = async (status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED") => {
    if (!selectedBookingId) {
      toast.error("Selecione um agendamento primeiro")
      return
    }

    setIsLoading(true)

    const statusMap = {
      IN_PROGRESS: "Atendendo",
      COMPLETED: "Concluído",
      CANCELLED: "Cancelado"
    }

    try {
      const result = await updateBookingStatus(selectedBookingId, status)

      if (result.success) {
        toast.success(`Status atualizado para: ${statusMap[status]}`)
        setSelectedBookingId("") // Limpa seleção após sucesso
      } else {
        toast.error("Erro ao atualizar status")
      }
    } catch (error) {
      toast.error("Erro ao atualizar status")
    } finally {
      setIsLoading(false)
    }
  }

  // Filtra apenas agendamentos que podem ter status alterado
  const activeBookings = bookings.filter(
    booking => booking.status === "SCHEDULED" || booking.status === "IN_PROGRESS"
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Seletor de agendamento */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Selecione o agendamento:</label>
          <Select
            value={selectedBookingId}
            onValueChange={setSelectedBookingId}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Escolha um agendamento" />
            </SelectTrigger>
            <SelectContent>
              {activeBookings.length > 0 ? (
                activeBookings.map((booking) => (
                  <SelectItem key={booking.id} value={booking.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {new Date(booking.date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {booking.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {booking.service.name} com {booking.barber.name}
                      </span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  Nenhum agendamento ativo
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Botões de ação */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => handleStatusUpdate("IN_PROGRESS")}
            disabled={!selectedBookingId || isLoading}
          >
            <PlayCircle className="h-4 w-4 text-blue-600" />
            Atendendo
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => handleStatusUpdate("COMPLETED")}
            disabled={!selectedBookingId || isLoading}
          >
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Concluído
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => handleStatusUpdate("CANCELLED")}
            disabled={!selectedBookingId || isLoading}
          >
            <XCircle className="h-4 w-4 text-red-600" />
            Cliente Faltou
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => {
              // Usa o mesmo status CANCELLED mas podemos adicionar uma nota
              handleStatusUpdate("CANCELLED")
            }}
            disabled={!selectedBookingId || isLoading}
          >
            <UserX className="h-4 w-4 text-orange-600" />
            Cliente Cancelou
          </Button>
        </div>

        {/* Informação sobre atualização automática */}
        <div className="flex items-start gap-2 pt-2 border-t">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Agendamentos são atualizados automaticamente após o horário terminar.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}