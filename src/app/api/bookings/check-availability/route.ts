import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function POST(request: Request) {
  try {
    const { barberId, date, duration } = await request.json()

    const bookingDate = new Date(date)
    const endTime = new Date(bookingDate)
    endTime.setMinutes(endTime.getMinutes() + duration)

    // Check if there's any overlapping booking
    const overlappingBooking = await db.booking.findFirst({
      where: {
        barberId,
        status: {
          notIn: ["CANCELLED"]
        },
        AND: [
          {
            date: {
              lt: endTime
            }
          },
          {
            date: {
              gte: bookingDate
            }
          }
        ]
      }
    })

    return NextResponse.json({ 
      available: !overlappingBooking,
      reason: overlappingBooking ? "Time slot already booked" : null
    })
  } catch (error) {
    console.error("Error checking availability:", error)
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    )
  }
}