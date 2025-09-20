import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/Auth"
import { db } from "@/app/_lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has dashboard permissions (not regular USER)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || user.role === "USER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    // Use provided date or default to today
    const selectedDate = dateParam ? new Date(dateParam) : new Date()
    selectedDate.setHours(0, 0, 0, 0)

    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)

    // Fetch barbers
    const barbers = await db.barber.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Fetch bookings for the selected date
    const bookings = await db.booking.findMany({
      where: {
        date: {
          gte: selectedDate,
          lt: nextDay
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        service: {
          select: {
            name: true,
            price: true
          }
        },
        barber: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Format data for the component
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      date: new Date(booking.date), // Convert to Date object
      duration: 60, // Default duration
      status: booking.status,
      barberId: booking.barberId,
      user: {
        name: booking.user.name,
        image: booking.user.image,
        phone: booking.user.email // Temporary until we have phone field
      },
      service: {
        name: booking.service.name,
        duration: 60 // Default duration
      },
      barber: {
        id: booking.barber.id,
        name: booking.barber.name
      }
    }))

    // Calculate upcoming bookings (next 2 hours from current time)
    const currentTime = new Date()
    const nextTwoHours = new Date()
    nextTwoHours.setHours(nextTwoHours.getHours() + 2)

    const upcomingBookings = formattedBookings.filter(
      booking => {
        // booking.date is already a Date object now
        return booking.date >= currentTime && booking.date <= nextTwoHours && booking.status === "SCHEDULED"
      }
    )

    return NextResponse.json({
      bookings: formattedBookings,
      barbers,
      upcomingBookings,
      selectedDate: selectedDate.toISOString(),
      stats: {
        total: bookings.length,
        scheduled: bookings.filter(b => b.status === "SCHEDULED").length,
        inProgress: bookings.filter(b => b.status === "IN_PROGRESS").length,
        completed: bookings.filter(b => b.status === "COMPLETED").length,
        cancelled: bookings.filter(b => b.status === "CANCELLED").length
      }
    })

  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}