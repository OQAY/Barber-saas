"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/Auth"
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
    // Verificar se o serviço existe
    const service = await db.barbershopService.findUnique({
      where: { id: validatedData.serviceId },
      include: { barbershop: true }
    })

    if (!service) {
      const error = new Error("Serviço não encontrado")
      logger.error("Create booking failed: Service not found", error, {
        userId,
        serviceId: validatedData.serviceId
      })
      throw error
    }

    // Verificar se o barbeiro existe e está ativo
    const barber = await db.barber.findUnique({
      where: { id: validatedData.barberId },
      include: { barbershop: true }
    })

    if (!barber || !barber.isActive) {
      const error = new Error("Barbeiro não encontrado ou inativo")
      logger.error("Create booking failed: Barber not found or inactive", error, {
        userId,
        barberId: validatedData.barberId,
        barberIsActive: barber?.isActive
      })
      throw error
    }

    // Verificar se já existe agendamento no mesmo horário
    const existingBooking = await db.booking.findFirst({
      where: {
        barberId: validatedData.barberId,
        date: validatedData.date,
        status: {
          not: "CANCELLED"
        }
      }
    })

    if (existingBooking) {
      const error = new Error("Horário já está ocupado")
      logger.warn("Create booking failed: Time slot already taken", {
        userId,
        barberId: validatedData.barberId,
        requestedDate: validatedData.date,
        existingBookingId: existingBooking.id
      })
      throw error
    }

    // Criar o agendamento
    const booking = await db.booking.create({
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

    logger.userAction("booking_created", userId, {
      bookingId: booking.id,
      serviceName: service.name,
      barberName: barber.name,
      barbershopName: barber.barbershop.name,
      scheduledDate: validatedData.date,
      price: service.price
    })

    revalidatePath("/barbershops/[id]")
    revalidatePath("/bookings")

    return booking

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
