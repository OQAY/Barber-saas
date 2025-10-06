"use client"

import { useState, useMemo } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/app/_components/ui/sheet"
import { Button } from "@/app/_components/ui/button"
import { Label } from "@/app/_components/ui/label"
import { Input } from "@/app/_components/ui/input"
import { Calendar } from "@/app/_components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { createQuickBooking } from "@/app/_actions/create-quick-booking"
import { CalendarIcon, Clock, Scissors, User, Sun, CloudSun, Moon } from "lucide-react"
import { useDashboard } from "@/app/_contexts/dashboard-context"
import { useRouter } from "next/navigation"

interface Barber {
  id: string
  name: string
}

interface QuickBookingModalProps {
  isOpen: boolean
  onClose: () => void
  barbers: Barber[]
  selectedDate?: Date
}

// Horários por período
const MORNING_TIMES = ["09:00", "10:00", "11:00"]
const AFTERNOON_TIMES = ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
const EVENING_TIMES = ["19:00", "20:00"]

export default function QuickBookingModal({
  isOpen,
  onClose,
  barbers,
  selectedDate: initialDate
}: QuickBookingModalProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate || new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedBarber, setSelectedBarber] = useState<string>("")
  const [clientName, setClientName] = useState<string>("")
  const [clientPhone, setClientPhone] = useState<string>("")
  const [serviceName, setServiceName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  // Aqui você pode filtrar horários disponíveis baseado em bookings existentes
  const morningTimes = useMemo(() => MORNING_TIMES, [])
  const afternoonTimes = useMemo(() => AFTERNOON_TIMES, [])
  const eveningTimes = useMemo(() => EVENING_TIMES, [])

  const handleCreateBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedBarber || !clientName || !serviceName) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    setIsLoading(true)

    // Criar horário completo
    const [hours, minutes] = selectedTime.split(":").map(Number)
    const bookingDate = new Date(selectedDate)
    bookingDate.setHours(hours, minutes, 0, 0)

    const toastId = toast.loading("Criando encaixe...")

    try {
      const result = await createQuickBooking({
        barberId: selectedBarber,
        clientName,
        clientPhone: clientPhone || undefined,
        serviceName,
        date: bookingDate
      })

      if (result.success) {
        toast.success("Encaixe criado com sucesso!", { id: toastId })

        // Limpar form
        setSelectedTime("")
        setSelectedBarber("")
        setClientName("")
        setClientPhone("")
        setServiceName("")

        onClose()

        // Recarregar página para atualizar a agenda
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        toast.error(result.error || "Erro ao criar encaixe", { id: toastId })
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar encaixe", { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedTime("")
    setSelectedBarber("")
    setClientName("")
    setClientPhone("")
    setServiceName("")
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="max-h-[100vh] overflow-y-auto px-0 w-3/4 sm:max-w-[600px]">
        <SheetHeader className="px-6">
          <SheetTitle>Novo Encaixe</SheetTitle>
          <SheetDescription>
            Crie um agendamento rápido diretamente na agenda
          </SheetDescription>
        </SheetHeader>

        {/* Calendário */}
        <div className="border-b border-solid">
          <Calendar
            mode="single"
            locale={ptBR}
            selected={selectedDate}
            onSelect={setSelectedDate}
            fromDate={new Date()}
          />
        </div>

        {/* Seleção de Horário dividida por período */}
        {selectedDate && (
          <div className="flex flex-col gap-2 border-b border-solid p-3">
            {/* MANHÃ */}
            <div className="flex items-center gap-2">
              <Sun className="text-yellow-500" />
              <span className="text-sm font-semibold">Manhã</span>
            </div>
            <div className="flex flex-wrap gap-2 px-4">
              {morningTimes.length > 0 ? (
                morningTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="rounded-full px-3 py-1 text-xs"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))
              ) : (
                <p className="px-8 text-xs font-semibold">
                  Não há horários disponíveis pela manhã.
                </p>
              )}
            </div>

            {/* TARDE */}
            <div className="flex items-center gap-2">
              <CloudSun className="text-orange-500" />
              <span className="text-sm font-semibold">Tarde</span>
            </div>
            <div className="flex flex-wrap gap-2 px-4">
              {afternoonTimes.length > 0 ? (
                afternoonTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="rounded-full px-3 py-1 text-xs"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))
              ) : (
                <p className="px-8 text-xs font-semibold">
                  Não há horários disponíveis à tarde.
                </p>
              )}
            </div>

            {/* NOITE */}
            <div className="flex items-center gap-2">
              <Moon className="text-blue-500" />
              <span className="text-sm font-semibold">Noite</span>
            </div>
            <div className="flex flex-wrap gap-2 px-4">
              {eveningTimes.length > 0 ? (
                eveningTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="rounded-full px-3 py-1 text-xs"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))
              ) : (
                <p className="px-8 text-xs font-semibold">
                  Não há horários disponíveis à noite.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Informações do cliente e serviço */}
        {selectedTime && (
          <div className="space-y-4 p-6 border-b">
            {/* Barbeiro */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Scissors className="h-4 w-4" />
                Barbeiro *
              </Label>
              <div className="flex flex-wrap gap-2">
                {barbers.map((barber) => (
                  <Button
                    key={barber.id}
                    variant={selectedBarber === barber.id ? "default" : "outline"}
                    className="rounded-full px-3 py-1 text-xs"
                    onClick={() => setSelectedBarber(barber.id)}
                  >
                    {barber.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cliente */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome do Cliente *
              </Label>
              <Input
                placeholder="Digite o nome"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Telefone (opcional)</Label>
              <Input
                placeholder="(00) 00000-0000"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </div>

            {/* Serviço */}
            <div className="space-y-2">
              <Label>Serviço *</Label>
              <Input
                placeholder="Ex: Corte + Barba"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Resumo e botão confirmar */}
        {selectedDate && selectedTime && selectedBarber && (
          <div className="p-6 space-y-4">
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium">Resumo do Agendamento:</p>
              <p className="text-sm text-muted-foreground mt-1">
                <CalendarIcon className="inline h-3 w-3 mr-1" />
                {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })} às {selectedTime}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <Scissors className="inline h-3 w-3 mr-1" />
                {barbers.find(b => b.id === selectedBarber)?.name}
              </p>
            </div>

            <SheetFooter>
              <Button
                className="w-full"
                onClick={handleCreateBooking}
                disabled={isLoading || !clientName || !serviceName}
              >
                {isLoading ? "Criando..." : "Criar Encaixe"}
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
