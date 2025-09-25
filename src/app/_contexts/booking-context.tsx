"use client"

import { BarbershopService } from "@prisma/client"
import { createContext, useContext, useState, ReactNode } from "react"

interface SelectedService {
  service: BarbershopService & { price: number }
  barberId: string
}

interface BookingContextData {
  selectedServices: SelectedService[]
  addService: (service: BarbershopService & { price: number }, barberId: string) => void
  removeService: (serviceId: string) => void
  clearServices: () => void
  getTotalPrice: () => number
  getTotalDuration: () => number
  getServiceCount: () => number
  isServiceSelected: (serviceId: string) => boolean
}

const BookingContext = createContext<BookingContextData | null>(null)

interface BookingProviderProps {
  children: ReactNode
}

export function BookingProvider({ children }: BookingProviderProps) {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])

  const addService = (service: BarbershopService & { price: number }, barberId: string) => {
    setSelectedServices((prev) => {
      // Verifica se o serviço já está selecionado
      const alreadyExists = prev.some(item => item.service.id === service.id)
      if (alreadyExists) return prev

      return [...prev, { service, barberId }]
    })
  }

  const removeService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.filter(item => item.service.id !== serviceId)
    )
  }

  const clearServices = () => {
    setSelectedServices([])
  }

  const getTotalPrice = () => {
    return selectedServices.reduce((total, item) => total + item.service.price, 0)
  }

  const getTotalDuration = () => {
    // Estima 30 minutos por serviço (pode ser customizado depois)
    return selectedServices.length * 30
  }

  const getServiceCount = () => {
    return selectedServices.length
  }

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(item => item.service.id === serviceId)
  }

  const contextValue: BookingContextData = {
    selectedServices,
    addService,
    removeService,
    clearServices,
    getTotalPrice,
    getTotalDuration,
    getServiceCount,
    isServiceSelected,
  }

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking deve ser usado dentro de um BookingProvider')
  }
  return context
}