import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ hasAccess: false }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user) {
      return NextResponse.json({ hasAccess: false }, { status: 404 })
    }

    // Verifica se o usuário tem role OWNER ou MANAGER
    const hasAccess = user.role === "OWNER" || user.role === "MANAGER"

    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error("Error checking admin role:", error)
    return NextResponse.json({ hasAccess: false }, { status: 500 })
  }
}