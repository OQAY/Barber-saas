import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/Auth"
import { redirect } from "next/navigation"
import AdminHeader from "./_components/admin-header"
import AdminSidebar from "./_components/admin-sidebar"
import { db } from "@/app/_lib/prisma"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  // Se não há sessão, apenas renderiza o children (para página de login)
  if (!session?.user) {
    return <>{children}</>
  }

  // Verificar role do usuário
  const user = await db.user.findUnique({
    where: { id: (session.user as any).id },
    select: { role: true, name: true, email: true, image: true }
  })

  if (!user || (user.role !== "OWNER" && user.role !== "MANAGER")) {
    return <>{children}</>
  }

  return (
    <>
      <AdminHeader user={user} />
      {children}
    </>
  )
}