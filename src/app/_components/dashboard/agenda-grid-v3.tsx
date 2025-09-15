"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { format } from "date-fns"
import { cn } from "@/app/_lib/utils"
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

export default function AgendaGridV3({ bookings, barbers }: AgendaGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Criar horários do dia (8h às 20h) de 30 em 30 minutos
  const timeSlots: string[] = []
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
    if (hour < 20) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }

  // Função para calcular a posição top do card baseado no horário
  const getTopPosition = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const startHour = 8
    const slotHeight = 58

    // Calcula quantos slots de 30 min passaram desde 8h
    const slotsFromStart = ((hours - startHour) * 2) + (minutes >= 30 ? 1 : 0)
    return slotsFromStart * slotHeight
  }

  // Função para calcular a altura do card baseado na duração
  const getCardHeight = (booking: Booking) => {
    const duration = booking.duration || booking.service.duration || 60
    const slots = Math.ceil(duration / 30)
    return (slots * 58) - 4 // -4 para margem
  }

  // Obter horário atual para destacar
  const currentTime = new Date()
  const currentTimeString = format(currentTime, 'HH:mm')

  // Configuração de cores por status
  const getStatusConfig = (status: string) => {
    const configs = {
      SCHEDULED: {
        border: "border-blue-500",
        bg: "bg-blue-50",
        text: "text-blue-900"
      },
      IN_PROGRESS: {
        border: "border-yellow-500",
        bg: "bg-yellow-50",
        text: "text-yellow-900"
      },
      COMPLETED: {
        border: "border-green-500",
        bg: "bg-green-50",
        text: "text-green-900"
      },
      CANCELLED: {
        border: "border-red-500",
        bg: "bg-red-50",
        text: "text-red-900"
      }
    }
    return configs[status as keyof typeof configs] || configs.SCHEDULED
  }

  // Mouse drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX)
    setScrollLeft(scrollRef.current.scrollLeft)
    scrollRef.current.style.cursor = "grabbing"
    scrollRef.current.style.userSelect = "none"
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab"
      scrollRef.current.style.userSelect = "auto"
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX
    const distance = startX - x
    scrollRef.current.scrollLeft = scrollLeft + distance
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab"
      scrollRef.current.style.userSelect = "auto"
    }
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setStartX(e.touches[0].pageX)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    const x = e.touches[0].pageX
    const distance = startX - x
    scrollRef.current.scrollLeft = scrollLeft + distance
  }

  return (
    <Card className="overflow-hidden w-full">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Agenda Completa</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* Header com horário fixo e nomes scrolláveis */}
          <div className="flex border-b sticky top-0 z-30 bg-background">
            {/* Coluna de horário fixa */}
            <div className="w-16 sm:w-20 flex-shrink-0 sticky left-0 z-40 bg-background border-r">
              <div className="font-semibold text-xs sm:text-sm p-2 bg-muted h-8 sm:h-10 flex items-center justify-center">
                Horário
              </div>
            </div>

            {/* Colunas dos barbeiros com scroll e drag */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-x-auto scrollbar-hide cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
            >
              <div className="flex">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className="w-[120px] sm:w-[150px] flex-shrink-0 p-1 sm:p-2 text-center font-semibold text-xs sm:text-sm border-r bg-muted"
                  >
                    <span className="truncate block">{barber.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Container principal com altura fixa */}
          <div className="relative overflow-y-auto" style={{ height: '400px', maxHeight: '60vh' }}>
            {/* Grid de fundo - apenas visual */}
            <div className="absolute inset-0">
              {timeSlots.map((time, index) => {
                const isPastTime = time < currentTimeString
                const isCurrentTime = time === currentTimeString

                return (
                  <div
                    key={time}
                    className={cn(
                      "absolute w-full flex",
                      isPastTime && "opacity-50",
                      isCurrentTime && "bg-yellow-50"
                    )}
                    style={{
                      top: `${index * 58}px`,
                      height: '58px',
                      borderBottom: '1px solid #e5e7eb'
                    }}
                  >
                    {/* Coluna de horário */}
                    <div className={cn(
                      "w-16 sm:w-20 flex-shrink-0 sticky left-0 z-20 bg-background border-r p-1 sm:p-2 flex items-center justify-center",
                      isCurrentTime && "text-yellow-600 font-bold bg-yellow-50"
                    )}>
                      <span className="text-xs sm:text-sm font-medium">{time}</span>
                      {isCurrentTime && (
                        <span className="ml-1 text-[10px] bg-yellow-500 text-white px-1 rounded hidden sm:inline">
                          AGORA
                        </span>
                      )}
                    </div>

                    {/* Colunas dos barbeiros - apenas linhas divisórias */}
                    <div className="flex-1 flex overflow-hidden">
                      {barbers.map((barber) => (
                        <div
                          key={`${barber.id}-${time}`}
                          className="w-[120px] sm:w-[150px] flex-shrink-0 border-r"
                          style={{ height: '58px' }}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Camada de agendamentos - posicionamento absoluto */}
            <div className="absolute inset-0 pointer-events-none" style={{ marginLeft: '64px' }}>
              {barbers.map((barber, barberIndex) => (
                <div
                  key={barber.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${barberIndex * (window.innerWidth < 640 ? 120 : 150)}px`,
                    width: window.innerWidth < 640 ? '120px' : '150px',
                    top: 0,
                    bottom: 0
                  }}
                >
                  {bookings
                    .filter(booking => booking.barberId === barber.id)
                    .map(booking => {
                      const status = getStatusConfig(booking.status)
                      const top = getTopPosition(booking.date)
                      const height = getCardHeight(booking)

                      return (
                        <div
                          key={booking.id}
                          className={cn(
                            "absolute left-1 right-1 p-1 sm:p-2 cursor-pointer transition-all rounded border",
                            "hover:shadow-lg hover:z-10 hover:scale-[1.02]",
                            status.border,
                            status.bg,
                            status.text
                          )}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            zIndex: 5
                          }}
                        >
                          <div className="flex flex-col h-full text-[9px] sm:text-[10px] leading-tight">
                            <div className="font-semibold uppercase truncate mb-0.5 sm:mb-1">
                              {booking.status === "IN_PROGRESS" ? "ATENDENDO" :
                               booking.status === "SCHEDULED" ? "AGENDADO" :
                               booking.status === "COMPLETED" ? "CONCLUÍDO" : "CANCELADO"}
                            </div>
                            <div className="truncate font-medium text-[10px] sm:text-[11px]">
                              {booking.user.name}
                            </div>
                            <div className="truncate opacity-80 text-[9px] sm:text-[10px]">
                              {booking.service.name}
                            </div>
                            <div className="flex-1" />
                            <div className="opacity-60 text-[8px] sm:text-[9px] mt-0.5 sm:mt-1">
                              {booking.duration || booking.service.duration || 60}min
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* Add to global CSS */
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`