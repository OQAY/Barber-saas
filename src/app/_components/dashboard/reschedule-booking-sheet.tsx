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
import { Calendar } from "@/app/_components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { CalendarIcon, Scissors, Sun, CloudSun, Moon } from "lucide-react"

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
    id: string
  }
}

interface Barber {
  id: string
  name: string
}

interface RescheduleBookingSheetProps {
  isOpen: boolean
  onClose: () => void
  booking: Booking | null
  barbers: Barber[]
}

// Horários por período
const MORNING_TIMES = ["09:00", "10:00", "11:00"]
const AFTERNOON_TIMES = ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
const EVENING_TIMES = ["19:00", "20:00"]

export default function RescheduleBookingSheet({
  isOpen,
  onClose,
  booking,
  barbers
}: RescheduleBookingSheetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedBarber, setSelectedBarber] = useState<string>(booking?.barber.id || "")
  const [isLoading, setIsLoading] = useState(false)

  // Aqui você pode filtrar horários disponíveis baseado em bookings existentes
  const morningTimes = useMemo(() => MORNING_TIMES, [])
  const afternoonTimes = useMemo(() => AFTERNOON_TIMES, [])
  const eveningTimes = useMemo(() => EVENING_TIMES, [])

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
      handleClose()
    } catch (error) {
      toast.error("Erro ao remarcar agendamento")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedDate(undefined)
    setSelectedTime("")
    setSelectedBarber(booking?.barber.id || "")
    onClose()
  }

  if (!booking) return null

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="max-h-[100vh] overflow-y-auto px-0 w-3/4 sm:max-w-[600px]">
        <SheetHeader className="px-6">
          <SheetTitle>Reagendar Atendimento</SheetTitle>
          <SheetDescription>
            Cliente: {booking.user.name} - {booking.service.name}
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
            disabled={(date) => date.getDay() === 0} // Desabilita domingos
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

        {/* Seleção de Barbeiro (opcional) */}
        {selectedTime && (
          <div className="space-y-4 p-6 border-b">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Scissors className="h-4 w-4" />
                Barbeiro (opcional - mantenha o mesmo ou troque)
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
          </div>
        )}

        {/* Resumo e botão confirmar */}
        {selectedDate && selectedTime && (
          <div className="p-6 space-y-4">
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium">Novo Horário:</p>
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
                onClick={handleReschedule}
                disabled={isLoading}
              >
                {isLoading ? "Reagendando..." : "Confirmar Reagendamento"}
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
