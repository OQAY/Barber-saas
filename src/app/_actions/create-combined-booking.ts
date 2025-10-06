"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { logger } from "../_lib/logger"
import { addMinutes } from "date-fns"

interface SelectedService {
  service: {
    id: string
    name: string
    price: number
  }
  barberId: string
}

interface CreateCombinedBookingParams {
  selectedServices: SelectedService[]
  startDate: Date
}

export const createCombinedBooking = async (params: CreateCombinedBookingParams) => {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    const error = new Error("Usuário não autenticado")
    logger.error("Create combined booking failed: User not authenticated", error)
    throw error
  }

  const { selectedServices, startDate } = params

  if (!selectedServices.length) {
    throw new Error("Nenhum serviço selecionado")
  }

  try {
    // Usar transaction para criar UMA ÚNICA reserva combinada
    const booking = await db.$transaction(async (tx) => {
      // Validar todos os serviços e barbeiros
      const servicesData = []
      let totalPrice = 0
      const barberIds = new Set<string>()

      for (const selectedService of selectedServices) {
        // Verificar se o serviço existe
        const service = await tx.barbershopService.findUnique({
          where: { id: selectedService.service.id },
          include: { barbershop: true }
        })

        if (!service) {
          throw new Error(`Serviço ${selectedService.service.name} não encontrado`)
        }

        // Verificar se o barbeiro existe
        const barber = await tx.barber.findUnique({
          where: { id: selectedService.barberId },
          include: { barbershop: true }
        })

        if (!barber || !barber.isActive) {
          throw new Error(`Barbeiro para ${selectedService.service.name} não encontrado`)
        }

        servicesData.push({ service, barber })
        totalPrice += Number(service.price)
        barberIds.add(selectedService.barberId)
      }

      // Usar o barbeiro principal (primeiro da lista)
      const mainBarberId = selectedServices[0].barberId
      const totalDuration = getTotalDuration(selectedServices)

      // Verificar conflitos para todo o período
      const conflictCheck = await tx.booking.findFirst({
        where: {
          barberId: mainBarberId,
          date: {
            gte: startDate,
            lt: addMinutes(startDate, totalDuration)
          },
          status: { not: "CANCELLED" }
        }
      })

      if (conflictCheck) {
        throw new Error("Horário já está ocupado para este período")
      }

      // Criar UMA ÚNICA reserva combinada
      const combinedServiceName = selectedServices
        .map(s => s.service.name)
        .join(" + ")

      // Usar o primeiro serviço como base e adicionar os outros nas notas
      const mainService = servicesData[0].service

      const booking = await tx.booking.create({
        data: {
          serviceId: mainService.id,
          barberId: mainBarberId,
          date: startDate,
          userId: userId,
          status: "SCHEDULED",
          totalPrice: totalPrice,
          notes: `Serviços combinados: ${combinedServiceName}\nDuração total: ${totalDuration} minutos\nPreço total: R$ ${totalPrice.toFixed(2)}`
        },
        include: {
          service: true,
          barber: {
            include: {
              barbershop: true
            }
          }
        }
      })

      return {
        booking,
        combinedServiceName,
        totalDuration,
        totalPrice,
        servicesCount: selectedServices.length
      }
    })

    // Log de sucesso
    logger.userAction("combined_booking_created", userId, {
      bookingId: booking.booking.id,
      combinedServices: booking.combinedServiceName,
      servicesCount: booking.servicesCount,
      totalDuration: booking.totalDuration,
      startTime: startDate,
      totalPrice: booking.totalPrice,
      barberId: selectedServices[0].barberId
    })

    revalidatePath("/bookings")

    return {
      success: true,
      booking: booking.booking,
      message: `Agendamento combinado criado: ${booking.combinedServiceName}`
    }

  } catch (error) {
    logger.apiError("create-combined-booking", error as Error, {
      userId,
      selectedServices: selectedServices.map(s => ({
        serviceId: s.service.id,
        serviceName: s.service.name,
        barberId: s.barberId
      })),
      startDate
    })

    throw error
  }
}

// Função helper para determinar duração baseada no nome do serviço
function getServiceDuration(serviceName: string): number {
  const name = serviceName.toLowerCase()

  if (name.includes('corte') && name.includes('barba')) return 60
  if (name.includes('corte')) return 30
  if (name.includes('barba')) return 20
  if (name.includes('sobrancelha')) return 15
  if (name.includes('bigode')) return 10
  if (name.includes('acabamento')) return 15
  if (name.includes('massagem')) return 30
  if (name.includes('hidratação')) return 45
  if (name.includes('pigmentação')) return 40

  return 30
}

// Função helper para calcular duração total
function getTotalDuration(selectedServices: SelectedService[]): number {
  return selectedServices.reduce((total, service) => {
    return total + getServiceDuration(service.service.name)
  }, 0)
}

