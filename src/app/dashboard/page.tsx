import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/app/_components/ui/button"
import { Users } from "lucide-react"
import Header from "../_components/layout/header"
import NextClients from "../_components/dashboard/next-clients"
import AgendaGrid from "../_components/dashboard/agenda-grid"
import TestBookings from "../_components/dashboard/test-bookings"
import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/Auth"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  // Verificar autenticação
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  // Verificar se usuário tem permissão (barbeiro, gerente ou dono)
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (!user || user.role === "USER") {
    redirect("/") // Usuários comuns não podem acessar o dashboard
  }

  // Buscar dados do dia atual
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Buscar barbeiros ativos
  const barbers = await db.barber.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  // Buscar agendamentos do dia
  const bookings = await db.booking.findMany({
    where: {
      date: {
        gte: today,
        lt: tomorrow
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

  // Formatar dados para o componente
  const formattedBookings = bookings.map(booking => ({
    id: booking.id,
    date: booking.date,
    duration: 60, // Duração padrão de 60 minutos (será melhorado quando adicionarmos duration no schema)
    status: booking.status,
    barberId: booking.barberId,
    user: {
      name: booking.user.name,
      image: booking.user.image,
      phone: booking.user.email // Temporário até termos campo phone
    },
    service: {
      name: booking.service.name,
      duration: 60 // Duração padrão
    },
    barber: {
      name: booking.barber.name
    }
  }))

  // Filtrar próximos clientes (próximas 2 horas)
  const currentTime = new Date()
  const nextTwoHours = new Date()
  nextTwoHours.setHours(nextTwoHours.getHours() + 2)

  const upcomingBookings = formattedBookings.filter(
    booking => {
      const bookingTime = new Date(booking.date)
      return bookingTime >= currentTime && bookingTime <= nextTwoHours && booking.status === "SCHEDULED"
    }
  )

  return (
    <>
      <Header />

      <div className="p-3 sm:p-5 space-y-4 sm:space-y-6">
        {/* Header do Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Agenda do Dia</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>

          <Button size="default" className="gap-2 w-full sm:w-auto">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Novo Encaixe</span>
            <span className="sm:hidden">Encaixe</span>
          </Button>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
          <div className="bg-card p-3 sm:p-4 rounded-lg border">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Hoje</p>
            <p className="text-xl sm:text-2xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-lg border">
            <p className="text-xs sm:text-sm text-muted-foreground">Confirmados</p>
            <p className="text-xl sm:text-2xl font-bold">
              {bookings.filter(b => b.status === "SCHEDULED").length}
            </p>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-lg border">
            <p className="text-xs sm:text-sm text-muted-foreground">Em Atendimento</p>
            <p className="text-xl sm:text-2xl font-bold">
              {bookings.filter(b => b.status === "IN_PROGRESS").length}
            </p>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-lg border">
            <p className="text-xs sm:text-sm text-muted-foreground">Concluídos</p>
            <p className="text-xl sm:text-2xl font-bold">
              {bookings.filter(b => b.status === "COMPLETED").length}
            </p>
          </div>
        </div>

        {/* Layout responsivo - Mobile first, depois desktop */}
        <div className="space-y-4 lg:space-y-0 lg:grid lg:gap-6 lg:grid-cols-3">
          {/* Mobile: Agenda primeiro / Desktop: Coluna 2-3 */}
          <div className="lg:col-span-2 lg:order-2">
            <AgendaGrid bookings={formattedBookings} barbers={barbers} />
          </div>

          {/* Mobile: Cards depois / Desktop: Coluna 1 */}
          <div className="space-y-4 lg:col-span-1 lg:order-1">
            <NextClients bookings={upcomingBookings} />
            <TestBookings barbers={barbers} />
          </div>
        </div>
      </div>
    </>
  )
}