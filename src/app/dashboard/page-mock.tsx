import { db } from "@/app/_lib/prisma"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/app/_components/ui/button"
import { Users } from "lucide-react"
import Header from "../_components/layout/header"
import NextClients from "../_components/dashboard/next-clients"
import QuickActions from "../_components/dashboard/quick-actions"
import AgendaGrid from "../_components/dashboard/agenda-grid"
import { DashboardProvider } from "../_contexts/dashboard-context"

export default async function DashboardOperacional() {
  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0))
  const todayEnd = new Date(now.setHours(23, 59, 59, 999))
  
  // Buscar agendamentos de hoje com todos os detalhes
  const todayBookings = await db.booking.findMany({
    where: {
      date: {
        gte: todayStart,
        lt: todayEnd
      }
    },
    include: {
      user: true,
      service: true,
      barber: true
    },
    orderBy: {
      date: "asc"
    }
  })

  // Buscar todos os barbeiros ativos
  const barbers = await db.barber.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  })

  // Formatar bookings para os componentes
  const formattedBookings = todayBookings.map(booking => ({
    id: booking.id,
    date: booking.date,
    duration: 60, // Duração padrão
    status: booking.status,
    barberId: booking.barberId,
    user: {
      name: booking.user.name,
      image: booking.user.image,
      phone: booking.user.phone
    },
    service: {
      name: booking.service.name,
      price: Number(booking.service.price) as number, // Converter Decimal para number
      duration: 60 // Duração padrão
    },
    barber: {
      id: booking.barber.id,
      name: booking.barber.name
    }
  }))

  // Próximos clientes (próximas 2 horas)
  const nextTwoHours = new Date()
  nextTwoHours.setHours(nextTwoHours.getHours() + 2)

  const upcomingBookings = formattedBookings.filter(
    booking => booking.date >= new Date() && booking.date <= nextTwoHours
  )

  // Calcular estatísticas
  const stats = {
    total: formattedBookings.length,
    scheduled: formattedBookings.filter(b => b.status === "SCHEDULED").length,
    inProgress: formattedBookings.filter(b => b.status === "IN_PROGRESS").length,
    completed: formattedBookings.filter(b => b.status === "COMPLETED").length,
    cancelled: formattedBookings.filter(b => b.status === "CANCELLED").length,
  }

  return (
    <DashboardProvider initialBookings={formattedBookings} initialStats={stats}>
      <Header />

      <div className="p-5 space-y-6">
        {/* Header do Dashboard */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Agenda do Dia</h1>
            <p className="text-muted-foreground">
              {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>

          <Button size="lg" className="gap-2">
            <Users className="h-4 w-4" />
            Novo Encaixe
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna 1: Próximos Clientes e Ações */}
          <div className="lg:col-span-1 space-y-4">
            <NextClients bookings={upcomingBookings} />
            <QuickActions bookings={formattedBookings} />
          </div>

          {/* Coluna 2-3: Grid de Agenda */}
          <div className="lg:col-span-2">
            <AgendaGrid barbers={barbers} />
          </div>
        </div>
      </div>
    </DashboardProvider>
  )
}