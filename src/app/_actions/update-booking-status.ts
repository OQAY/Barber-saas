"use server"

import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"
import { BookingStatus } from "@prisma/client"

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  try {
    const updatedBooking = await db.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status,
      },
    })

    revalidatePath("/dashboard")
    
    return { success: true, booking: updatedBooking }
  } catch (error) {
    console.error("Error updating booking status:", error)
    return { success: false, error: "Failed to update booking status" }
  }
}

// Função para atualizar múltiplos agendamentos de uma vez
export async function updateMultipleBookingsStatus(
  bookingIds: string[],
  status: BookingStatus
) {
  try {
    const updatedBookings = await db.booking.updateMany({
      where: {
        id: {
          in: bookingIds,
        },
      },
      data: {
        status,
      },
    })

    revalidatePath("/dashboard")
    
    return { success: true, count: updatedBookings.count }
  } catch (error) {
    console.error("Error updating multiple bookings:", error)
    return { success: false, error: "Failed to update bookings" }
  }
}

// Função para atualizar automaticamente agendamentos vencidos
export async function updateExpiredBookings() {
  try {
    const now = new Date()
    
    // Atualiza agendamentos que já passaram do horário e ainda estão como SCHEDULED
    const expiredBookings = await db.booking.updateMany({
      where: {
        date: {
          lt: now,
        },
        status: "SCHEDULED",
      },
      data: {
        status: "COMPLETED", // Assume como concluído se passou do horário
      },
    })

    // Atualiza agendamentos que estão em progresso há mais de 2 horas
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
    const longRunningBookings = await db.booking.updateMany({
      where: {
        date: {
          lt: twoHoursAgo,
        },
        status: "IN_PROGRESS",
      },
      data: {
        status: "COMPLETED",
      },
    })

    revalidatePath("/dashboard")
    
    return {
      success: true,
      expired: expiredBookings.count,
      longRunning: longRunningBookings.count,
    }
  } catch (error) {
    console.error("Error updating expired bookings:", error)
    return { success: false, error: "Failed to update expired bookings" }
  }
}