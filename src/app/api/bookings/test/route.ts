import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/Auth"

export async function POST(request: Request) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission (only staff can create test data)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || user.role === "USER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { bookings } = await request.json()

    // Create all bookings
    const createdBookings = await Promise.all(
      bookings.map(async (booking: {
        barberId: string
        clientName: string
        serviceName: string
        date: string
        duration: number
        status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
        price: number
      }) => {
        // Find or create a test user
        let testUser = await db.user.findFirst({
          where: { email: `${booking.clientName.toLowerCase().replace(/ /g, '.')}@test.com` }
        })

        if (!testUser) {
          testUser = await db.user.create({
            data: {
              name: booking.clientName,
              email: `${booking.clientName.toLowerCase().replace(/ /g, '.')}@test.com`,
              role: "USER"
            }
          })
        }

        // Find a matching service for the barbershop
        const barber = await db.barber.findUnique({
          where: { id: booking.barberId },
          include: { barbershop: true }
        })

        if (!barber) {
          return null
        }

        // Find or use first available service
        let service = await db.barbershopService.findFirst({
          where: {
            barbershopId: barber.barbershopId,
            name: {
              contains: booking.serviceName,
              mode: 'insensitive'
            }
          }
        })

        if (!service) {
          // Use the first service available for this barbershop
          service = await db.barbershopService.findFirst({
            where: { barbershopId: barber.barbershopId }
          })
        }

        if (!service) {
          return null
        }

        // Create the booking
        return await db.booking.create({
          data: {
            userId: testUser.id,
            serviceId: service.id,
            barberId: booking.barberId,
            date: new Date(booking.date),
            status: booking.status
          }
        })
      })
    )

    const created = createdBookings.filter(b => b !== null).length

    return NextResponse.json({ created, message: `${created} test bookings created successfully` })
  } catch (error) {
    console.error("Error creating test bookings:", error)
    return NextResponse.json(
      { error: "Failed to create test bookings" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || user.role === "USER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete bookings from test users (emails ending with @test.com)
    const testUsers = await db.user.findMany({
      where: {
        email: { endsWith: "@test.com" }
      },
      select: { id: true }
    })

    const testUserIds = testUsers.map(u => u.id)

    // Delete bookings from test users
    const result = await db.booking.deleteMany({
      where: {
        userId: { in: testUserIds }
      }
    })

    return NextResponse.json({ 
      deleted: result.count, 
      message: `${result.count} test bookings deleted successfully` 
    })
  } catch (error) {
    console.error("Error deleting test bookings:", error)
    return NextResponse.json(
      { error: "Failed to delete test bookings" },
      { status: 500 }
    )
  }
}