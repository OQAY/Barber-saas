"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { logger } from "../_lib/logger"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/Auth"

export const cancelBooking = async (bookingId: string) => {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!bookingId) {
    const error = new Error("ID do agendamento é obrigatório")
    logger.error("Cancel booking failed: Missing booking ID", error, { userId })
    throw error
  }

  try {
    // Verificar se o booking existe e pertence ao usuário
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { user: true, service: true, barber: true }
    })

    if (!booking) {
      const error = new Error("Agendamento não encontrado")
      logger.error("Cancel booking failed: Booking not found", error, {
        bookingId,
        userId
      })
      throw error
    }

    if (booking.userId !== userId) {
      const error = new Error("Não autorizado a cancelar este agendamento")
      logger.error("Cancel booking failed: Unauthorized", error, {
        bookingId,
        userId,
        bookingOwnerId: booking.userId
      })
      throw error
    }

    // Verificar se o agendamento não já foi cancelado
    if (booking.status === "CANCELLED") {
      const error = new Error("Agendamento já foi cancelado")
      logger.warn("Attempted to cancel already cancelled booking", {
        bookingId,
        userId,
        currentStatus: booking.status
      })
      throw error
    }

    // Atualizar status ao invés de deletar (melhor para auditoria)
    await db.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        updatedAt: new Date()
      }
    })

    logger.userAction("booking_cancelled", userId!, {
      bookingId,
      serviceName: booking.service.name,
      barberName: booking.barber.name,
      originalDate: booking.date
    })

    revalidatePath("/")
    revalidatePath("/bookings")

  } catch (error) {
    // Re-throw known business logic errors
    if (error instanceof Error && (
      error.message.includes("Agendamento não encontrado") ||
      error.message.includes("Agendamento já foi cancelado") ||
      error.message.includes("Não autorizado a cancelar") ||
      error.message.includes("ID do agendamento é obrigatório")
    )) {
      throw error
    }

    // Log unexpected errors
    logger.apiError("cancel-booking", error as Error, {
      bookingId,
      userId
    })

    throw new Error("Erro interno do servidor. Tente novamente.")
  }
}
