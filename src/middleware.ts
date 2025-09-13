import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Rotas admin que precisam de proteção
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || process.env.NEXT_AUTH_SECRET 
    })

    // Se não há token, redireciona para login
    if (!token) {
      const loginUrl = new URL("/auth/admin", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Buscar o usuário completo com role
    const response = await fetch(`${request.nextUrl.origin}/api/admin/check-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: token.sub }),
    })

    if (!response.ok) {
      return NextResponse.redirect(new URL("/auth/admin", request.url))
    }

    const { hasAccess } = await response.json()

    // Verifica se o usuário tem role OWNER ou MANAGER
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}