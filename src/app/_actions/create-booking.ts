"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/Auth"

interface CreateBookingParams {
  serviceId: string
  barberId?: string
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const user = await getServerSession(authOptions)
  if (!user) {
    throw new Error("Usuário não autenticado")
  }
  
  // Correção temporária: se não tem barberId, pega o primeiro barbeiro disponível
  let barberId = params.barberId
  if (!barberId) {
    const firstBarber = await db.barber.findFirst({
      where: { isActive: true }
    })
    if (!firstBarber) {
      throw new Error("Nenhum barbeiro disponível")
    }
    barberId = firstBarber.id
  }

  await db.booking.create({
    data: { 
      serviceId: params.serviceId,
      barberId: barberId,
      date: params.date,
      userId: (user.user as any).id,
      status: "SCHEDULED"
    },
  })
  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
}
