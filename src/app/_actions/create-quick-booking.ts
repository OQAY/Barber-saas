"use server"

import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/Auth"

interface CreateQuickBookingParams {
  barberId: string
  clientName: string
  clientPhone?: string
  serviceName: string
  date: Date
}

export async function createQuickBooking({
  barberId,
  clientName,
  clientPhone,
  serviceName,
  date
}: CreateQuickBookingParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, error: "Usuário não autenticado" }
    }

    // Verificar se o usuário tem permissão (não pode ser USER comum)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || user.role === "USER") {
      return { success: false, error: "Sem permissão para criar encaixes" }
    }

    // Verificar se o barbeiro existe
    const barber = await db.barber.findUnique({
      where: { id: barberId },
      include: { barbershop: true }
    })

    if (!barber) {
      return { success: false, error: "Barbeiro não encontrado" }
    }

    // Criar ou buscar um serviço genérico para encaixe
    let service = await db.barbershopService.findFirst({
      where: {
        barbershopId: barber.barbershopId,
        name: serviceName
      }
    })

    // Se não existir, criar um serviço temporário
    if (!service) {
      service = await db.barbershopService.create({
        data: {
          name: serviceName,
          description: "Serviço de encaixe",
          price: 0, // Preço a definir
          imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png", // Imagem padrão
          barbershopId: barber.barbershopId
        }
      })
    }

    // Criar usuário temporário para o cliente (se não existir)
    let clientUser = await db.user.findFirst({
      where: {
        name: clientName,
        ...(clientPhone && { phone: clientPhone })
      }
    })

    if (!clientUser) {
      clientUser = await db.user.create({
        data: {
          name: clientName,
          email: `temp_${Date.now()}@encaixe.com`, // Email temporário único
          phone: clientPhone || null,
          role: "USER"
        }
      })
    }

    // Criar o agendamento
    const booking = await db.booking.create({
      data: {
        userId: clientUser.id,
        serviceId: service.id,
        barberId: barberId,
        date: date,
        status: "SCHEDULED"
      },
      include: {
        service: {
          include: {
            barbershop: true
          }
        },
        user: true,
        barber: true
      }
    })

    return {
      success: true,
      booking: {
        ...booking,
        date: booking.date.toISOString()
      }
    }
  } catch (error) {
    console.error("Erro ao criar encaixe:", error)
    return { success: false, error: "Erro interno do servidor" }
  }
}
