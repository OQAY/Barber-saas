"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { logger } from "../_lib/logger"
import { createBookingSchema, validateData, sanitizeString } from "../_lib/validations"

interface CreateBookingParams {
  serviceId: string
  barberId: string
  date: Date
  notes?: string
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    const error = new Error("Usuário não autenticado")
    logger.error("Create booking failed: User not authenticated", error)
    throw error
  }

  // Validação robusta usando Zod
  const validation = validateData(createBookingSchema, {
    serviceId: params.serviceId,
    barberId: params.barberId,
    date: params.date,
    notes: params.notes ? sanitizeString(params.notes) : undefined
  })

  if (!validation.success) {
    const error = new Error(`Dados inválidos: ${validation.errors.join(', ')}`)
    logger.error("Create booking failed: Validation error", error, {
      userId,
      validationErrors: validation.errors,
      providedData: params
    })
    throw error
  }

  const validatedData = validation.data

  try {
    // Use transaction para otimizar e evitar múltiplas conexões que causam Jest worker issues
    const booking = await db.$transaction(async (tx) => {
      // Verificar se o serviço existe
      const service = await tx.barbershopService.findUnique({
        where: { id: validatedData.serviceId },
        include: { barbershop: true }
      })

      if (!service) {
        throw new Error("Serviço não encontrado")
      }

      // Verificar se o barbeiro existe e está ativo
      const barber = await tx.barber.findUnique({
        where: { id: validatedData.barberId },
        include: { barbershop: true }
      })

      if (!barber || !barber.isActive) {
        throw new Error("Barbeiro não encontrado ou inativo")
      }

      // Verificar se já existe agendamento no mesmo horário
      const existingBooking = await tx.booking.findFirst({
        where: {
          barberId: validatedData.barberId,
          date: validatedData.date,
          status: {
            not: "CANCELLED"
          }
        }
      })

      if (existingBooking) {
        throw new Error("Horário já está ocupado")
      }

      // Criar o agendamento
      const newBooking = await tx.booking.create({
        data: {
          serviceId: validatedData.serviceId,
          barberId: validatedData.barberId,
          date: validatedData.date,
          userId: userId,
          status: "SCHEDULED",
          totalPrice: service.price,
          notes: validatedData.notes
        },
        include: {
          service: true,
          barber: true
        }
      })

      return { booking: newBooking, service, barber }
    })

    // Log fora da transaction para evitar conflitos
    const { booking: newBooking, service, barber } = booking

    logger.userAction("booking_created", userId, {
      bookingId: newBooking.id,
      serviceName: service.name,
      barberName: barber.name,
      barbershopName: barber.barbershop.name,
      scheduledDate: validatedData.date,
      price: service.price
    })

    // Reduzir revalidations para evitar conflitos
    revalidatePath("/bookings")

    return newBooking

  } catch (error) {
    // Re-throw known business logic errors
    if (error instanceof Error && (
      error.message.includes("Serviço não encontrado") ||
      error.message.includes("Barbeiro não encontrado") ||
      error.message.includes("Horário já está ocupado") ||
      error.message.includes("Data não") ||
      error.message.includes("Usuário não") ||
      error.message.includes("Dados inválidos")
    )) {
      throw error
    }

    // Log unexpected errors
    logger.apiError("create-booking", error as Error, {
      userId,
      validatedData
    })

    throw new Error("Erro interno do servidor. Tente novamente.")
  }
}
