"use server"

import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/Auth"
import { revalidatePath } from "next/cache"

export async function deleteBooking(bookingId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, error: "Usuário não autenticado" }
    }

    // Check if user has permission (not regular USER)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || user.role === "USER") {
      return { success: false, error: "Sem permissão para deletar agendamentos" }
    }

    // First, check if booking exists and is cancelled
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      select: { status: true }
    })

    if (!booking) {
      return { success: false, error: "Agendamento não encontrado" }
    }

    if (booking.status !== "CANCELLED") {
      return { success: false, error: "Apenas agendamentos cancelados podem ser removidos da lista" }
    }

    // Delete the booking
    await db.booking.delete({
      where: { id: bookingId }
    })

    // Revalidate the dashboard to refresh the data
    revalidatePath("/dashboard")

    return { success: true, message: "Agendamento removido da lista com sucesso" }
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error)
    return { success: false, error: "Erro interno do servidor" }
  }
}