import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/Auth"
import { db } from "@/app/_lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Activity,
  UserCheck,
  Clock,
  AlertCircle
} from "lucide-react"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0))
  const todayEnd = new Date(now.setHours(23, 59, 59, 999))
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  
  // Buscar estatísticas relevantes do dia
  const [
    todayScheduled,
    todayCompleted,
    todayCancelled,
    todayPending,
    monthRevenue,
    lastMonthRevenue,
    barbersWorkingToday,
    nextBookings
  ] = await Promise.all([
    // Agendamentos de hoje
    db.booking.count({
      where: {
        date: { gte: todayStart, lt: todayEnd },
        status: "SCHEDULED"
      }
    }),
    db.booking.count({
      where: {
        date: { gte: todayStart, lt: todayEnd },
        status: "COMPLETED"
      }
    }),
    db.booking.count({
      where: {
        date: { gte: todayStart, lt: todayEnd },
        status: "CANCELLED"
      }
    }),
    // Agendamentos pendentes (ainda não atendidos hoje)
    db.booking.count({
      where: {
        date: { gte: new Date(), lt: todayEnd },
        status: "SCHEDULED"
      }
    }),
    // Receita do mês
    db.booking.aggregate({
      where: {
        date: { gte: monthStart },
        status: "COMPLETED"
      },
      _sum: { totalPrice: true }
    }),
    // Receita mês anterior
    db.booking.aggregate({
      where: {
        date: { gte: lastMonthStart, lt: lastMonthEnd },
        status: "COMPLETED"
      },
      _sum: { totalPrice: true }
    }),
    // Barbeiros trabalhando hoje
    db.barber.count({ where: { isActive: true } }),
    // Próximos 5 agendamentos
    db.booking.findMany({
      where: {
        date: { gte: new Date() },
        status: "SCHEDULED"
      },
      take: 5,
      orderBy: { date: "asc" },
      include: {
        user: true,
        service: true,
        barber: true
      }
    })
  ])

  const totalToday = todayScheduled + todayCompleted
  const currentMonthRevenue = Number(monthRevenue._sum.totalPrice || 0)
  const previousMonthRevenue = Number(lastMonthRevenue._sum.totalPrice || 0)
  const revenueGrowth = previousMonthRevenue > 0 
    ? Number(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1))
    : 0

  const stats = [
    {
      title: "Agendamentos Hoje",
      value: totalToday.toString(),
      description: `${todayCompleted} concluídos, ${todayPending} pendentes`,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Faturamento do Mês",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(currentMonthRevenue),
      description: `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% vs mês anterior`,
      icon: DollarSign,
      color: revenueGrowth > 0 ? "text-green-600" : "text-red-600",
      bgColor: revenueGrowth > 0 ? "bg-green-100" : "bg-red-100"
    },
    {
      title: "Cancelamentos Hoje",
      value: todayCancelled.toString(),
      description: todayCancelled > 0 ? "Atenção necessária" : "Tudo em ordem",
      icon: AlertCircle,
      color: todayCancelled > 0 ? "text-red-600" : "text-green-600",
      bgColor: todayCancelled > 0 ? "bg-red-100" : "bg-green-100"
    },
    {
      title: "Barbeiros Ativos",
      value: barbersWorkingToday.toString(),
      description: "Disponíveis hoje",
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ]

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo, {(session?.user as any)?.name || "Admin"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Próximos Agendamentos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>
              Clientes chegando em breve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextBookings.length > 0 ? (
                nextBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{booking.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {booking.service.name} - {booking.barber.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold">
                      {new Date(booking.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum agendamento próximo</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Dia</CardTitle>
            <CardDescription>
              Métricas importantes de hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Taxa de Ocupação</span>
                </div>
                <span className="text-lg font-bold">
                  {totalToday > 0 ? Math.round((todayCompleted / totalToday) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Atendimentos Pendentes</span>
                </div>
                <span className="text-lg font-bold">{todayPending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Ticket Médio</span>
                </div>
                <span className="text-lg font-bold">
                  {todayCompleted > 0 
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(currentMonthRevenue / todayCompleted)
                    : "R$ 0,00"
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas do Dia */}
      {(todayCancelled > 0 || todayPending === 0) && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Pontos de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayCancelled > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • {todayCancelled} cancelamento(s) hoje - verifique os motivos
                </p>
              )}
              {todayPending === 0 && totalToday > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • Todos os agendamentos de hoje já foram atendidos
                </p>
              )}
              {totalToday === 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • Nenhum agendamento para hoje - considere ações de marketing
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}