"use client"

import { cn } from "@/app/_lib/utils"
import { useEffect, useRef, useState } from "react"

interface BookingSlotProps {
  booking?: {
    id: string
    status: string
    user: {
      name: string | null
    }
    service: {
      name: string
    }
  }
  time: string
  barberId: string
  slotInfo?: {
    isStart: boolean
    isEnd: boolean
    isMiddle: boolean
    totalSlots: number
  }
  timeIndex?: number
}

export default function BookingSlot({ booking, slotInfo }: BookingSlotProps) {
  // Hooks devem ser declarados antes de qualquer return
  const nameRef = useRef<HTMLDivElement>(null)
  const serviceRef = useRef<HTMLDivElement>(null)
  const [nameWidth, setNameWidth] = useState(0)
  const [serviceWidth, setServiceWidth] = useState(0)
  
  const isLongName = booking?.user?.name ? booking.user.name.length > 15 : false
  const isLongService = booking?.service?.name ? booking.service.name.length > 15 : false

  useEffect(() => {
    if (nameRef.current && isLongName) {
      setNameWidth(nameRef.current.scrollWidth)
    }
    if (serviceRef.current && isLongService) {
      setServiceWidth(serviceRef.current.scrollWidth)
    }
  }, [booking, isLongName, isLongService])

  // Slot vazio
  if (!booking || !slotInfo) {
    return (
      <div
        className="h-[56px] border border-dashed border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-center"
      >
        <p className="text-[10px] text-gray-400">
          Livre
        </p>
      </div>
    )
  }

  // Configuração de cores por status
  const statusConfig = {
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

  const status = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.SCHEDULED

  // Para slots do meio ou fim, não renderiza nada (o card principal já ocupa o espaço visualmente)
  if (slotInfo.isMiddle || slotInfo.isEnd) {
    return <div className="h-[56px]" />
  }
  
  // Calcula altura baseada no número de slots (58px por slot)
  const cardHeight = slotInfo.totalSlots * 58

  // Calcula duração da animação baseada no tamanho do texto (10px por segundo)
  const nameAnimationDuration = nameWidth ? `${nameWidth / 10}s` : '8s'
  const serviceAnimationDuration = serviceWidth ? `${serviceWidth / 10}s` : '8s'

  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 p-2 cursor-pointer transition-all",
        "hover:shadow-md hover:z-30",
        "border rounded",
        status.border,
        status.bg,
        status.text
      )}
      style={{
        height: `${cardHeight - 2}px`,
        zIndex: 20
      }}
    >
      <div className="flex flex-col h-full text-[10px] leading-tight">
        {/* Status - linha 1 */}
        <div className="font-semibold uppercase truncate mb-1">
          {booking.status === "IN_PROGRESS" ? "ATENDENDO" : 
           booking.status === "SCHEDULED" ? "AGENDADO" :
           booking.status === "COMPLETED" ? "CONCLUÍDO" : "CANCELADO"}
        </div>

        {/* Nome do cliente - linha 2 com marquee se necessário */}
        <div className="relative h-3 overflow-hidden mb-1">
          {isLongName ? (
            <div 
              ref={nameRef}
              className="absolute whitespace-nowrap"
              style={{
                animation: `scroll-text ${nameAnimationDuration} linear infinite`
              }}
            >
              {booking.user.name} • {booking.user.name} • 
            </div>
          ) : (
            <div className="truncate font-medium">{booking.user.name}</div>
          )}
        </div>

        {/* Serviço - linha 3 com marquee se necessário */}
        <div className="relative h-3 overflow-hidden opacity-80">
          {isLongService ? (
            <div 
              ref={serviceRef}
              className="absolute whitespace-nowrap"
              style={{
                animation: `scroll-text ${serviceAnimationDuration} linear infinite`
              }}
            >
              {booking.service.name} • {booking.service.name} • 
            </div>
          ) : (
            <div className="truncate">{booking.service.name}</div>
          )}
        </div>

        {/* Espaço flexível para expandir verticalmente */}
        <div className="flex-1" />
        
        {/* Duração - no fim do card */}
        <div className="opacity-60 text-[9px] mt-2">
          {slotInfo.totalSlots * 30}min
        </div>
      </div>
    </div>
  )
}