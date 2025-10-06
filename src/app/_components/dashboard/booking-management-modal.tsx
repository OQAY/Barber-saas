"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog"
import { Button } from "@/app/_components/ui/button"
import { Badge } from "@/app/_components/ui/badge"
import {
  PlayCircle,
  CheckCircle2,
  XCircle,
  UserX,
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { updateBookingStatus } from "@/app/_actions/update-booking-status"
import { deleteBooking } from "@/app/_actions/delete-booking"
import { toast } from "sonner"
import { cn } from "@/app/_lib/utils"
import { useDashboard } from "@/app/_contexts/dashboard-context"
import RescheduleBookingSheet from "./reschedule-booking-sheet"

interface Booking {
  id: string
  date: Date
  status: string
  user: {
    name: string | null
    image?: string | null
    phone?: string | null
  }
  service: {
    name: string
    price?: number
    duration?: number
  }
  barber: {
    name: string
    id: string
  }
}

interface BookingManagementModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  barbers?: Array<{ id: string; name: string }>
}

export default function BookingManagementModal({
  booking,
  isOpen,
  onClose,
  barbers = [],
}: BookingManagementModalProps) {
  const { updateBookingStatusOptimistic, revertBookingStatus, deleteBookingOptimistic, revertBookingDeletion } = useDashboard()
  const [isLoading, setIsLoading] = useState(false)
  const [rescheduleSheetOpen, setRescheduleSheetOpen] = useState(false)

  if (!booking) return null

  const handleStatusUpdate = async (status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED") => {
    const oldStatus = booking.status // Guardar estado antigo para possível rollback
    const statusMessages = {
      SCHEDULED: "Agendado",
      IN_PROGRESS: "Em Atendimento",
      COMPLETED: "Concluído",
      CANCELLED: "Cancelado",
    }

    setIsLoading(true)

    // 1. ATUALIZA UI IMEDIATAMENTE (Optimistic Update)
    updateBookingStatusOptimistic(booking.id, status)

    // 2. Fecha modal instantaneamente para melhor UX
    onClose()

    // 3. Mostra toast de loading
    const toastId = toast.loading(`Atualizando para ${statusMessages[status]}...`)

    try {
      // 4. CHAMA API NO BACKGROUND
      const result = await updateBookingStatus(booking.id, status)

      if (result.success) {
        // 5. SUCESSO: UI já foi atualizada, apenas confirma
        toast.success(`Agendamento marcado como ${statusMessages[status]}`, { id: toastId })
      } else {
        // 6. ERRO: REVERTE mudança visual
        revertBookingStatus(booking.id, oldStatus as any)
        toast.error("Erro ao atualizar status", { id: toastId })
      }
    } catch (error) {
      // 7. ERRO: REVERTE mudança visual
      revertBookingStatus(booking.id, oldStatus as any)
      toast.error("Erro ao atualizar status", { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }


  const handleDeleteBooking = async () => {
    if (!confirm("Tem certeza que deseja retirar este agendamento da lista? Esta ação não pode ser desfeita.")) {
      return
    }

    setIsLoading(true)

    // 1. REMOVE DA UI IMEDIATAMENTE (Optimistic Update)
    const bookingBackup = deleteBookingOptimistic(booking.id)

    // 2. Fecha modal instantaneamente
    onClose()

    // 3. Mostra toast de loading
    const toastId = toast.loading("Removendo agendamento...")

    try {
      // 4. CHAMA API NO BACKGROUND
      const result = await deleteBooking(booking.id)

      if (result.success) {
        // 5. SUCESSO: UI já foi atualizada, apenas confirma
        toast.success("Agendamento removido da lista!", { id: toastId })
        // NÃO precisa mais de window.location.reload() ✅
      } else {
        // 6. ERRO: REVERTE deleção
        if (bookingBackup) {
          revertBookingDeletion(bookingBackup)
        }
        toast.error(result.error || "Erro ao remover", { id: toastId })
      }
    } catch (error) {
      // 7. ERRO: REVERTE deleção
      if (bookingBackup) {
        revertBookingDeletion(bookingBackup)
      }
      toast.error("Erro ao remover agendamento", { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SCHEDULED: { label: "Agendado", variant: "default" as const, icon: Clock, className: "" },
      IN_PROGRESS: { label: "Em Atendimento", variant: "secondary" as const, icon: PlayCircle, className: "" },
      COMPLETED: { label: "Concluído", variant: "default" as const, icon: CheckCircle2, className: "bg-green-500 text-white border-green-500" },
      CANCELLED: { label: "Cancelado", variant: "destructive" as const, icon: XCircle, className: "" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SCHEDULED
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={cn("gap-1", config.className)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Gerenciar Agendamento</span>
            {getStatusBadge(booking.status)}
          </DialogTitle>
          <DialogDescription>
            Visualize e gerencie este agendamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Agendamento */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{booking.user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Serviço</p>
                  <p className="font-medium">{booking.service.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Data/Hora</p>
                  <p className="font-medium">
                    {format(new Date(booking.date), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Barbeiro</p>
                  <p className="font-medium">{booking.barber.name}</p>
                </div>
              </div>

              {booking.service.price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium">
                      R$ {booking.service.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {booking.service.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duração</p>
                    <p className="font-medium">{booking.service.duration} min</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ações do Agendamento */}
          <div className="space-y-4">
            {/* Botão Reagendar */}
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setRescheduleSheetOpen(true)}
              disabled={isLoading || booking.status === "CANCELLED"}
            >
              <RefreshCw className="h-4 w-4" />
              Reagendar Atendimento
            </Button>

            {/* Alterar Status */}
            <div className="space-y-4">
              <div className="border-t pt-4"></div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Selecione o novo status para este agendamento
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => handleStatusUpdate("SCHEDULED")}
                  disabled={isLoading || booking.status === "SCHEDULED"}
                >
                  <Clock className="h-4 w-4 text-gray-600" />
                  Agendado
                </Button>

                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => handleStatusUpdate("IN_PROGRESS")}
                  disabled={isLoading || booking.status === "IN_PROGRESS"}
                >
                  <PlayCircle className="h-4 w-4 text-blue-600" />
                  Em Atendimento
                </Button>

                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => handleStatusUpdate("COMPLETED")}
                  disabled={isLoading || booking.status === "COMPLETED"}
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Concluído
                </Button>

                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => handleStatusUpdate("CANCELLED")}
                  disabled={isLoading || booking.status === "CANCELLED"}
                >
                  <XCircle className="h-4 w-4 text-red-600" />
                  Cliente Faltou
                </Button>

                <Button
                  variant="outline"
                  className="justify-start gap-2 col-span-2"
                  onClick={() => handleStatusUpdate("CANCELLED")}
                  disabled={isLoading || booking.status === "CANCELLED"}
                >
                  <UserX className="h-4 w-4 text-orange-600" />
                  Cliente Cancelou
                </Button>
              </div>

              {/* Botão para Retirar da Lista - só aparece se estiver cancelado */}
              {booking.status === "CANCELLED" && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Este agendamento foi cancelado. Você pode removê-lo da lista para liberar o horário.
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full justify-center gap-2"
                    onClick={handleDeleteBooking}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                    Retirar da Lista
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Sheet de Reagendamento */}
      <RescheduleBookingSheet
        isOpen={rescheduleSheetOpen}
        onClose={() => setRescheduleSheetOpen(false)}
        booking={booking}
        barbers={barbers}
      />
    </Dialog>
  )
}