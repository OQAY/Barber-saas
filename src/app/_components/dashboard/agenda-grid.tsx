"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { format } from "date-fns"
import { cn } from "@/app/_lib/utils"
import { useRef, useState, useEffect } from "react"
import BookingManagementModal from "./booking-management-modal"

interface Booking {
  id: string
  date: Date
  duration?: number
  status: string
  barberId: string
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

interface Barber {
  id: string
  name: string
}

interface AgendaGridProps {
  bookings: Booking[]
  barbers: Barber[]
}

export default function AgendaGridV4({ bookings, barbers }: AgendaGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedBooking(null), 300) // Limpa após animação
  }

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
    const slotHeight = 50

    const slotsFromStart = ((hours - startHour) * 2) + (minutes >= 30 ? 1 : 0)
    return slotsFromStart * slotHeight
  }

  // Função para calcular a altura do card baseado na duração
  const getCardHeight = (booking: Booking) => {
    const duration = booking.duration || booking.service.duration || 60
    const slots = Math.ceil(duration / 30)
    return (slots * 50) - 4
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
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
    scrollContainerRef.current.style.cursor = "grabbing"
    scrollContainerRef.current.style.userSelect = "none"
    e.preventDefault()
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab"
      scrollContainerRef.current.style.userSelect = "auto"
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX
    const distance = (startX - x) * 1.5 // Multiplicador para scroll mais rápido
    scrollContainerRef.current.scrollLeft = scrollLeft + distance
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab"
      scrollContainerRef.current.style.userSelect = "auto"
    }
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    setStartX(e.touches[0].pageX)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    const x = e.touches[0].pageX
    const distance = (startX - x) * 1.5
    scrollContainerRef.current.scrollLeft = scrollLeft + distance
  }

  useEffect(() => {
    // Adicionar estilos globais para esconder scrollbar mas manter funcionalidade
    const style = document.createElement('style')
    style.textContent = `
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <>
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-base sm:text-lg">Agenda Completa</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          {/* Container principal com overflow */}
          <div className="flex">
            {/* Coluna de horários - FIXA */}
            <div className="flex-shrink-0 sticky left-0 z-20 bg-background border-r">
              {/* Header da coluna de horário */}
              <div className="h-10 border-b bg-muted flex items-center justify-center">
                <span className="text-xs sm:text-sm font-semibold">Horário</span>
              </div>

              {/* Horários */}
              {timeSlots.map((time) => {
                const isPastTime = time < currentTimeString
                const isCurrentTime = time === currentTimeString

                return (
                  <div
                    key={time}
                    className={cn(
                      "h-[50px] border-b flex items-center justify-center px-2 sm:px-3",
                      isPastTime && "opacity-50",
                      isCurrentTime && "bg-yellow-50 text-yellow-600 font-bold"
                    )}
                  >
                    <span className="text-xs sm:text-sm">{time}</span>
                  </div>
                )
              })}
            </div>

            {/* Área scrollável - BARBEIROS E CONTEÚDO JUNTOS */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-x-auto hide-scrollbar cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <div className="flex min-w-max">
                {barbers.map((barber) => (
                  <div key={barber.id} className="flex-shrink-0 w-[120px] sm:w-[140px] border-r">
                    {/* Nome do barbeiro */}
                    <div className="h-10 border-b bg-muted flex items-center justify-center px-1">
                      <span className="text-xs sm:text-sm font-semibold truncate">
                        {barber.name}
                      </span>
                    </div>

                    {/* Slots de tempo para este barbeiro */}
                    <div className="relative">
                      {timeSlots.map((time) => {
                        const isPastTime = time < currentTimeString

                        return (
                          <div
                            key={`${barber.id}-${time}`}
                            className={cn(
                              "h-[50px] border-b",
                              isPastTime && "opacity-50"
                            )}
                          />
                        )
                      })}

                      {/* Cards de agendamento - posicionamento absoluto */}
                      {bookings
                        .filter(booking => booking.barberId === barber.id)
                        .map(booking => {
                          const status = getStatusConfig(booking.status)
                          const top = getTopPosition(booking.date)
                          const height = getCardHeight(booking)

                          return (
                            <div
                              key={booking.id}
                              onClick={() => handleBookingClick(booking)}
                              className={cn(
                                "absolute left-1 right-1 p-1 cursor-pointer transition-all rounded border",
                                "hover:shadow-md hover:z-10 hover:scale-[1.02]",
                                status.border,
                                status.bg,
                                status.text
                              )}
                              style={{
                                top: `${top}px`,
                                height: `${height}px`
                              }}
                            >
                              <div className="flex flex-col h-full overflow-hidden">
                                <div className="text-[9px] sm:text-[10px] font-semibold uppercase truncate">
                                  {booking.status === "IN_PROGRESS" ? "EM ATEND." :
                                   booking.status === "SCHEDULED" ? "AGENDADO" :
                                   booking.status === "COMPLETED" ? "CONCLUÍDO" : "CANCELADO"}
                                </div>
                                <div className="text-[10px] sm:text-[11px] font-medium truncate">
                                  {booking.user.name}
                                </div>
                                <div className="text-[9px] sm:text-[10px] opacity-80 truncate">
                                  {booking.service.name}
                                </div>
                                <div className="flex-1" />
                                <div className="text-[8px] sm:text-[9px] opacity-60">
                                  {booking.duration || booking.service.duration || 60}min
                                </div>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                ))}

                {/* Espaço extra à direita para melhor scroll */}
                <div className="w-10 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Modal de Gerenciamento */}
    <BookingManagementModal
      booking={selectedBooking}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      barbers={barbers}
    />
  </>
  )
}