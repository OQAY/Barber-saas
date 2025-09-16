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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import { Calendar } from "@/app/_components/ui/calendar"
import { Label } from "@/app/_components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select"
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
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { updateBookingStatus } from "@/app/_actions/update-booking-status"
import { toast } from "sonner"
import { cn } from "@/app/_lib/utils"

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
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedBarber, setSelectedBarber] = useState<string>("")

  if (!booking) return null

  const handleStatusUpdate = async (status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED") => {
    setIsLoading(true)

    const statusMessages = {
      IN_PROGRESS: "Em Atendimento",
      COMPLETED: "Concluído",
      CANCELLED: "Cancelado",
    }

    try {
      const result = await updateBookingStatus(booking.id, status)

      if (result.success) {
        toast.success(`Agendamento marcado como ${statusMessages[status]}`)
        setTimeout(onClose, 500) // Fecha modal após sucesso
      } else {
        toast.error("Erro ao atualizar status")
      }
    } catch (error) {
      toast.error("Erro ao atualizar status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Selecione uma nova data e horário")
      return
    }

    setIsLoading(true)

    try {
      // Aqui você implementaria a lógica de reagendamento
      // Verificar disponibilidade
      // Atualizar no banco
      toast.success("Agendamento remarcado com sucesso!")
      setTimeout(onClose, 500)
    } catch (error) {
      toast.error("Erro ao remarcar agendamento")
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

  // Gerar horários disponíveis
  const timeSlots = []
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`)
    if (hour < 20) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:30`)
    }
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

          {/* Tabs de Ações */}
          <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="status">Alterar Status</TabsTrigger>
              <TabsTrigger value="reschedule">Reagendar</TabsTrigger>
            </TabsList>

            {/* Tab de Status */}
            <TabsContent value="status" className="space-y-4">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Selecione o novo status para este agendamento
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  className="justify-start gap-2"
                  onClick={() => handleStatusUpdate("CANCELLED")}
                  disabled={isLoading || booking.status === "CANCELLED"}
                >
                  <UserX className="h-4 w-4 text-orange-600" />
                  Cliente Cancelou
                </Button>
              </div>
            </TabsContent>

            {/* Tab de Reagendamento */}
            <TabsContent value="reschedule" className="space-y-4">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Escolha uma nova data e horário disponível
              </div>

              <div className="grid gap-4">
                {/* Seleção de Data */}
                <div className="space-y-2">
                  <Label>Nova Data</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={ptBR}
                    disabled={(date) =>
                      date < new Date() || date.getDay() === 0
                    }
                    className="rounded-md border"
                  />
                </div>

                {/* Seleção de Horário */}
                <div className="space-y-2">
                  <Label>Novo Horário</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Seleção de Barbeiro */}
                <div className="space-y-2">
                  <Label>Barbeiro (opcional)</Label>
                  <Select
                    value={selectedBarber || booking.barber.id}
                    onValueChange={setSelectedBarber}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Manter o mesmo barbeiro" />
                    </SelectTrigger>
                    <SelectContent>
                      {barbers.map((barber) => (
                        <SelectItem key={barber.id} value={barber.id}>
                          {barber.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleReschedule}
                  disabled={isLoading || !selectedDate || !selectedTime}
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Confirmar Reagendamento
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}