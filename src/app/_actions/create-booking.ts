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
  
  // Valida se o barberId foi fornecido
  if (!params.barberId) {
    throw new Error("É necessário selecionar um barbeiro para fazer a reserva")
  }

  await db.booking.create({
    data: { 
      serviceId: params.serviceId,
      barberId: params.barberId,
      date: params.date,
      userId: (user.user as any).id,
      status: "SCHEDULED"
    },
  })
  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
}
