"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { format } from "date-fns"
import BookingSlot from "./booking-slot"
import { cn } from "@/app/_lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { useRef, useState, useEffect } from "react"

interface Booking {
  id: string
  date: Date
  duration?: number
  status: string
  barberId: string
  user: {
    name: string | null
  }
  service: {
    name: string
    duration?: number
  }
}

interface Barber {
  id: string
  name: string
}

interface AgendaGridProps {
  bookings: Booking[]
  barbers: Barber[]
}

export default function AgendaGrid({ bookings, barbers }: AgendaGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Criar horários do dia (8h às 20h) de 30 em 30 minutos
  const timeSlots: string[] = []
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
    if (hour < 20) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }

  // Função para calcular quantos slots um agendamento ocupa
  const getBookingSlots = (booking: Booking) => {
    const duration = booking.duration || booking.service.duration || 60
    return Math.ceil(duration / 30)
  }

  // Criar mapa de agendamentos ocupados
  const occupiedSlots = new Map()
  bookings.forEach(booking => {
    const startTime = format(booking.date, 'HH:mm')
    const slots = getBookingSlots(booking)
    const startIndex = timeSlots.indexOf(startTime)
    
    if (startIndex !== -1) {
      for (let i = 0; i < slots; i++) {
        if (timeSlots[startIndex + i]) {
          const key = `${booking.barberId}-${timeSlots[startIndex + i]}`
          occupiedSlots.set(key, {
            booking,
            isStart: i === 0,
            isEnd: i === slots - 1,
            isMiddle: i > 0 && i < slots - 1,
            totalSlots: slots
          })
        }
      }
    }
  })

  // Obter horário atual para destacar
  const currentTime = new Date()
  const currentTimeString = format(currentTime, 'HH:mm')

  // Funções de scroll
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 250
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })

      setTimeout(checkScroll, 300)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Agenda Completa</CardTitle>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* Header com horário fixo e nomes scrolláveis */}
          <div className="flex border-b">
            {/* Coluna de horário fixa */}
            <div className="w-20 flex-shrink-0 sticky left-0 z-20 bg-background border-r">
              <div className="font-semibold text-sm p-2 bg-muted h-10 flex items-center justify-center">
                Horário
              </div>
            </div>
            
            {/* Colunas dos barbeiros com scroll */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-x-auto scrollbar-thin"
              onScroll={checkScroll}
            >
              <div className="flex">
                {barbers.map((barber) => (
                  <div key={barber.id} className="w-[130px] flex-shrink-0 p-2 text-center font-semibold text-sm border-r">
                    {barber.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid de horários */}
          <div className="relative max-h-[600px] overflow-y-auto">
            {timeSlots.map((time) => {
              const isPastTime = time < currentTimeString
              const isCurrentTime = time === currentTimeString

              return (
                <div
                  key={time}
                  className={cn(
                    "flex relative",
                    isPastTime && "opacity-50",
                    isCurrentTime && "bg-yellow-50"
                  )}
                  style={{
                    borderBottom: timeSlots.indexOf(time) < timeSlots.length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}
                >
                  {/* Coluna de horário fixa */}
                  <div className={cn(
                    "w-20 flex-shrink-0 sticky left-0 z-10 bg-background border-r p-2 flex items-center justify-center",
                    isCurrentTime && "text-yellow-600 font-bold bg-yellow-50"
                  )}>
                    <span className="text-sm font-medium">{time}</span>
                    {isCurrentTime && (
                      <span className="ml-1 text-xs bg-yellow-500 text-white px-1 rounded">
                        AGORA
                      </span>
                    )}
                  </div>
                  
                  {/* Slots dos barbeiros - ocultos mas sincronizados com o header */}
                  <div className="flex-1 overflow-x-hidden">
                    <div 
                      className="flex transition-transform"
                      style={{ 
                        transform: `translateX(-${scrollRef.current?.scrollLeft || 0}px)` 
                      }}
                    >
                      {barbers.map((barber) => {
                        const key = `${barber.id}-${time}`
                        const slotData = occupiedSlots.get(key)

                        // Para slots iniciais de agendamento, adiciona position relative
                        const isStartSlot = slotData?.isStart
                        
                        return (
                          <div 
                            key={key} 
                            className={cn(
                              "w-[130px] flex-shrink-0 p-1 border-r h-[58px]",
                              isStartSlot && "relative z-20"
                            )}
                          >
                            <BookingSlot
                              booking={slotData?.booking}
                              time={time}
                              barberId={barber.id}
                              slotInfo={slotData}
                              timeIndex={timeSlots.indexOf(time)}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}