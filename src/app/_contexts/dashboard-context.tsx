"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { BookingStatus } from "@prisma/client"

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

interface DashboardStats {
  total: number
  scheduled: number
  inProgress: number
  completed: number
  cancelled: number
}

interface DashboardContextType {
  bookings: Booking[]
  stats: DashboardStats
  setBookings: (bookings: Booking[]) => void
  updateBookingStatusOptimistic: (bookingId: string, newStatus: BookingStatus) => void
  revertBookingStatus: (bookingId: string, oldStatus: BookingStatus) => void
  deleteBookingOptimistic: (bookingId: string) => Booking | null
  revertBookingDeletion: (booking: Booking) => void
  refreshStats: () => void
}

const DashboardContext = createContext<DashboardContextType | null>(null)

interface DashboardProviderProps {
  children: ReactNode
  initialBookings: Booking[]
  initialStats: DashboardStats
  onDataUpdate?: (bookings: Booking[]) => void
}

export function DashboardProvider({
  children,
  initialBookings,
  initialStats,
  onDataUpdate
}: DashboardProviderProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [stats, setStats] = useState<DashboardStats>(initialStats)

  // Atualiza bookings quando initialBookings mudar (polling)
  useEffect(() => {
    setBookings(initialBookings)
    setStats(initialStats)
  }, [initialBookings, initialStats])

  // Recalcula estatísticas baseado nos bookings atuais
  const calculateStats = useCallback((currentBookings: Booking[]): DashboardStats => {
    return {
      total: currentBookings.length,
      scheduled: currentBookings.filter(b => b.status === "SCHEDULED").length,
      inProgress: currentBookings.filter(b => b.status === "IN_PROGRESS").length,
      completed: currentBookings.filter(b => b.status === "COMPLETED").length,
      cancelled: currentBookings.filter(b => b.status === "CANCELLED").length,
    }
  }, [])

  // Atualização optimistic de status
  const updateBookingStatusOptimistic = useCallback((bookingId: string, newStatus: BookingStatus) => {
    setBookings(prev => {
      const updated = prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      )
      // Atualiza stats automaticamente
      setStats(calculateStats(updated))
      return updated
    })
  }, [calculateStats])

  // Reverter mudança de status (em caso de erro)
  const revertBookingStatus = useCallback((bookingId: string, oldStatus: BookingStatus) => {
    setBookings(prev => {
      const reverted = prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: oldStatus }
          : booking
      )
      // Atualiza stats automaticamente
      setStats(calculateStats(reverted))
      return reverted
    })
  }, [calculateStats])

  // Deleção optimistic - retorna o booking deletado para poder reverter
  const deleteBookingOptimistic = useCallback((bookingId: string): Booking | null => {
    let deletedBooking: Booking | null = null

    setBookings(prev => {
      deletedBooking = prev.find(b => b.id === bookingId) || null
      const filtered = prev.filter(b => b.id !== bookingId)
      // Atualiza stats automaticamente
      setStats(calculateStats(filtered))
      return filtered
    })

    return deletedBooking
  }, [calculateStats])

  // Reverter deleção (em caso de erro)
  const revertBookingDeletion = useCallback((booking: Booking) => {
    setBookings(prev => {
      const restored = [...prev, booking]
      // Atualiza stats automaticamente
      setStats(calculateStats(restored))
      return restored
    })
  }, [calculateStats])

  // Força recálculo de stats
  const refreshStats = useCallback(() => {
    setStats(calculateStats(bookings))
  }, [bookings, calculateStats])

  return (
    <DashboardContext.Provider value={{
      bookings,
      stats,
      setBookings,
      updateBookingStatusOptimistic,
      revertBookingStatus,
      deleteBookingOptimistic,
      revertBookingDeletion,
      refreshStats
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard deve ser usado dentro de um DashboardProvider")
  }
  return context
}
