"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/app/_components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Calendar } from "@/app/_components/ui/calendar"
import { Users, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import Header from "../_components/layout/header"
import NextClients from "../_components/dashboard/next-clients"
import AgendaGrid from "../_components/dashboard/agenda-grid"
import TestBookings from "../_components/dashboard/test-bookings"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

interface DashboardData {
  bookings: any[]
  barbers: any[]
  upcomingBookings: any[]
  selectedDate: string
  stats: {
    total: number
    scheduled: number
    inProgress: number
    completed: number
    cancelled: number
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCalendar, setShowCalendar] = useState(false)

  const fetchDashboardData = async (date: Date) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/dashboard/bookings?date=${format(date, "yyyy-MM-dd")}`)
      if (response.ok) {
        const data = await response.json()

        // Convert date strings back to Date objects
        const processedData = {
          ...data,
          bookings: data.bookings.map((booking: any) => ({
            ...booking,
            date: new Date(booking.date)
          })),
          upcomingBookings: data.upcomingBookings.map((booking: any) => ({
            ...booking,
            date: new Date(booking.date)
          }))
        }

        setDashboardData(processedData)
      }
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData(selectedDate)
    }
  }, [selectedDate, status])

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  // Authentication check
  if (status === "unauthenticated") {
    redirect("/login")
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setSelectedDate(newDate)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Erro ao carregar dados</p>
      </div>
    )
  }

  return (
    <>
      <Header />

      <div className="p-3 sm:p-5 space-y-4 sm:space-y-6">
        {/* Header do Dashboard com Seletor de Data */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Agenda</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>

            <Button size="default" className="gap-2 w-full sm:w-auto">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Novo Encaixe</span>
              <span className="sm:hidden">Encaixe</span>
            </Button>
          </div>

          {/* Navegação de Data */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCalendar(!showCalendar)}
                className="gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                {format(selectedDate, "dd/MM/yyyy")}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {!isToday && (
              <Button
                variant="default"
                size="sm"
                onClick={goToToday}
              >
                Hoje
              </Button>
            )}
          </div>

          {/* Calendar Popup */}
          {showCalendar && (
            <Card className="w-fit">
              <CardContent className="p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date)
                      setShowCalendar(false)
                    }
                  }}
                  locale={ptBR}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
          <div className="bg-card p-3 sm:p-4 rounded-lg border">
            <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
            <p className="text-xl sm:text-2xl font-bold">{dashboardData.stats.total}</p>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-lg border">
            <p className="text-xs sm:text-sm text-muted-foreground">Confirmados</p>
            <p className="text-xl sm:text-2xl font-bold">{dashboardData.stats.scheduled}</p>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-lg border">
            <p className="text-xs sm:text-sm text-muted-foreground">Em Atendimento</p>
            <p className="text-xl sm:text-2xl font-bold">{dashboardData.stats.inProgress}</p>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-lg border">
            <p className="text-xs sm:text-sm text-muted-foreground">Concluídos</p>
            <p className="text-xl sm:text-2xl font-bold">{dashboardData.stats.completed}</p>
          </div>
        </div>

        {/* Layout responsivo - Mobile first, depois desktop */}
        <div className="space-y-4 lg:space-y-0 lg:grid lg:gap-6 lg:grid-cols-3">
          {/* Mobile: Agenda primeiro / Desktop: Coluna 2-3 */}
          <div className="lg:col-span-2 lg:order-2">
            <AgendaGrid bookings={dashboardData.bookings} barbers={dashboardData.barbers} />
          </div>

          {/* Mobile: Cards depois / Desktop: Coluna 1 */}
          <div className="space-y-4 lg:col-span-1 lg:order-1">
            <NextClients bookings={dashboardData.upcomingBookings} />
            <TestBookings barbers={dashboardData.barbers} />
          </div>
        </div>
      </div>
    </>
  )
}