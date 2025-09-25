"use client"

import { Button } from "../ui/button"
import { useBooking } from "../../_contexts/booking-context"
import { useState, useMemo, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import { Calendar } from "../ui/calendar"
import { ptBR } from "date-fns/locale"
import { useSession } from "next-auth/react"
import { Sun, CloudSun, Moon } from "lucide-react"
import { set, isPast, isToday } from "date-fns"
import { createBooking } from "../../_actions/create-booking"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getBookings } from "../../_actions/get-bookings"
import { Booking } from "@prisma/client"
import BookingSummary from "./booking-summary"

const MORNING_TIMES = ["09:00", "10:00", "11:00"]
const AFTERNOON_TIMES = ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
const EVENING_TIMES = ["19:00", "20:00"]

const filterAvailableTimes = (
  times: string[],
  bookings: Booking[],
  selectedDay: Date,
) => {
  return times.filter((time) => {
    const [hour, minutes] = time.split(":").map(Number)

    const timeIsOnThePast = isPast(set(selectedDay, { hours: hour, minutes }))
    if (timeIsOnThePast && isToday(selectedDay)) {
      return false
    }

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minutes,
    )
    return !hasBookingOnCurrentTime
  })
}

export function CartSummary() {
  const { data } = useSession()
  const router = useRouter()
  const {
    selectedServices,
    getTotalPrice,
    getTotalDuration,
    getServiceCount,
    clearServices
  } = useBooking()

  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay || selectedServices.length === 0) return

      // Para múltiplos serviços, verifica conflitos com o primeiro barbeiro
      const firstService = selectedServices[0]
      const bookings = await getBookings({
        date: selectedDay,
        serviceId: firstService.service.id,
        barberId: firstService.barberId,
      })
      setDayBookings(bookings)
    }
    fetch()
  }, [selectedDay, selectedServices])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return
    return set(selectedDay, {
      hours: Number(selectedTime?.split(":")[0]),
      minutes: Number(selectedTime?.split(":")[1]),
    })
  }, [selectedDay, selectedTime])

  const morningTimes = useMemo(() => {
    if (!selectedDay) return []
    return filterAvailableTimes(MORNING_TIMES, dayBookings, selectedDay)
  }, [dayBookings, selectedDay])

  const afternoonTimes = useMemo(() => {
    if (!selectedDay) return []
    return filterAvailableTimes(AFTERNOON_TIMES, dayBookings, selectedDay)
  }, [dayBookings, selectedDay])

  const eveningTimes = useMemo(() => {
    if (!selectedDay) return []
    return filterAvailableTimes(EVENING_TIMES, dayBookings, selectedDay)
  }, [dayBookings, selectedDay])

  // Se não há serviços selecionados, não mostra o carrinho
  if (getServiceCount() === 0) {
    return null
  }

  const handleContinueClick = () => {
    if (!data?.user) {
      const currentPath = window.location.pathname
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`)
      return
    }
    setBookingSheetIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(new Date())
    setSelectedTime(undefined)
    setDayBookings([])
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBookings = async () => {
    try {
      if (!selectedDate) return

      // Criar um booking para cada serviço selecionado
      for (const selectedService of selectedServices) {
        await createBooking({
          serviceId: selectedService.service.id,
          barberId: selectedService.barberId,
          date: selectedDate,
        })
      }

      handleBookingSheetOpenChange()
      clearServices() // Limpa o carrinho após sucesso
      toast.success(`${getServiceCount()} reserva(s) criada(s) com sucesso!`, {
        action: {
          label: "Ver agendamentos",
          onClick: () => router.push("/bookings"),
        },
      })
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar reservas!")
    }
  }

  return (
    <>
      {/* Rodapé fixo - exatamente como no print */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Lado esquerdo: Preço, quantidade e tempo */}
          <div className="text-left">
            <div className="text-lg font-bold text-primary">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(getTotalPrice())}
            </div>
            <div className="text-sm text-muted-foreground">
              {getServiceCount()} serviço{getServiceCount() > 1 ? 's' : ''} • {getTotalDuration()} min
            </div>
          </div>

          {/* Lado direito: Botão Continuar */}
          <Button
            onClick={handleContinueClick}
            className="px-8"
          >
            Continuar
          </Button>
        </div>
      </div>

      {/* Modal de agendamento */}
      <Sheet
        open={bookingSheetIsOpen}
        onOpenChange={handleBookingSheetOpenChange}
      >
        <SheetContent className="max-h-[100vh] overflow-y-auto px-0">
          <SheetHeader>
            <SheetTitle>Fazer Reserva</SheetTitle>
          </SheetHeader>

          <div className="border-b border-solid">
            <Calendar
              mode="single"
              locale={ptBR}
              selected={selectedDay}
              onSelect={handleDateSelect}
              fromDate={new Date()}
            />
          </div>

          {selectedDay && (
            <>
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
                        variant={
                          selectedTime === time ? "default" : "outline"
                        }
                        className="rounded-full px-3 py-1 text-xs"
                        onClick={() => handleTimeSelect(time)}
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
                        variant={
                          selectedTime === time ? "default" : "outline"
                        }
                        className="rounded-full px-3 py-1 text-xs"
                        onClick={() => handleTimeSelect(time)}
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
                        variant={
                          selectedTime === time ? "default" : "outline"
                        }
                        className="rounded-full px-3 py-1 text-xs"
                        onClick={() => handleTimeSelect(time)}
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
            </>
          )}

          {selectedDate && (
            <div className="p-3">
              {/* Mostra resumo de todos os serviços selecionados */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Resumo do Agendamento:</h3>
                {selectedServices.map((selectedService) => (
                  <BookingSummary
                    key={selectedService.service.id}
                    barbershop={{ name: "Barbearia Premium" }}
                    service={selectedService.service}
                    selectedDate={selectedDate}
                  />
                ))}
              </div>
            </div>
          )}

          <SheetFooter className="p-3">
            <Button
              onClick={handleCreateBookings}
              disabled={!selectedDay || !selectedTime}
            >
              Confirmar Agendamento{getServiceCount() > 1 ? 's' : ''}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}