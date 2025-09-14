import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/app/_components/ui/button"
import { Users } from "lucide-react"
import Header from "../_components/layout/header"
import NextClients from "../_components/dashboard/next-clients"
import QuickActions from "../_components/dashboard/quick-actions"
import AgendaGrid from "../_components/dashboard/agenda-grid-v2"

export default function DashboardMock() {
  // Dados mockados para visualização com mais barbeiros
  const mockBarbers = [
    { id: "1", name: "João Silva" },
    { id: "2", name: "Pedro Santos" },
    { id: "3", name: "Carlos Oliveira" },
    { id: "4", name: "André Martins" },
    { id: "5", name: "Bruno Costa" },
    { id: "6", name: "Felipe Souza" }
  ]

  const now = new Date()
  const today = new Date()
  
  // Função helper para criar data com hora específica
  const setTime = (hours: number, minutes: number = 0) => {
    const date = new Date(today)
    date.setHours(hours, minutes, 0, 0)
    return date
  }
  
  const mockBookings = [
    // Agendamentos completos da manhã
    {
      id: "1",
      date: setTime(8, 0),
      duration: 60, // 1 hora - padrão
      status: "COMPLETED",
      barberId: "1",
      user: {
        name: "Carlos Alberto da Silva Pereira",
        image: null,
        phone: "(11) 98765-4321"
      },
      service: {
        name: "Corte + Barba",
        duration: 60
      },
      barber: {
        name: "João Silva"
      }
    },
    {
      id: "2",
      date: setTime(8, 30),
      duration: 30, // 30 min - serviço rápido
      status: "COMPLETED",
      barberId: "2",
      user: {
        name: "José Santos",
        image: null,
        phone: "(11) 91234-5678"
      },
      service: {
        name: "Barba Express",
        duration: 30
      },
      barber: {
        name: "Pedro Santos"
      }
    },
    {
      id: "3",
      date: setTime(9, 0),
      duration: 90, // 1h30 - serviço estendido
      status: "COMPLETED",
      barberId: "3",
      user: {
        name: "Roberto Nascimento",
        image: null,
        phone: "(11) 95555-5555"
      },
      service: {
        name: "Progressiva + Corte",
        duration: 90
      },
      barber: {
        name: "Carlos Oliveira"
      }
    },
    
    // Agendamentos em andamento (horário atual)
    {
      id: "4",
      date: setTime(10, 0),
      duration: 120, // 2 horas - coloração
      status: "IN_PROGRESS",
      barberId: "1",
      user: {
        name: "Marcelo Rodrigues de Almeida",
        image: null,
        phone: "(11) 94444-4444"
      },
      service: {
        name: "Coloração + Tratamento",
        duration: 120
      },
      barber: {
        name: "João Silva"
      }
    },
    {
      id: "5",
      date: setTime(10, 30),
      duration: 60,
      status: "IN_PROGRESS",
      barberId: "4",
      user: {
        name: "Fernando Lima",
        image: null,
        phone: "(11) 93333-3333"
      },
      service: {
        name: "Corte Degradê",
        duration: 60
      },
      barber: {
        name: "André Martins"
      }
    },
    
    // Próximos agendamentos
    {
      id: "6",
      date: setTime(11, 30),
      duration: 60,
      status: "SCHEDULED",
      barberId: "2",
      user: {
        name: "Paulo Henrique",
        image: null,
        phone: "(11) 92222-2222"
      },
      service: {
        name: "Corte Social",
        duration: 60
      },
      barber: {
        name: "Pedro Santos"
      }
    },
    {
      id: "7",
      date: setTime(12, 0),
      duration: 150, // 2h30 - luzes
      status: "SCHEDULED",
      barberId: "3",
      user: {
        name: "João Pedro Fernandes Costa Silva",
        image: null,
        phone: "(11) 91111-1111"
      },
      service: {
        name: "Luzes + Corte + Tratamento",
        duration: 150
      },
      barber: {
        name: "Carlos Oliveira"
      }
    },
    
    // Tarde
    {
      id: "8",
      date: setTime(14, 0),
      duration: 60,
      status: "SCHEDULED",
      barberId: "5",
      user: {
        name: "Ricardo Oliveira",
        image: null,
        phone: "(11) 90000-0000"
      },
      service: {
        name: "Corte + Barba",
        duration: 60
      },
      barber: {
        name: "Bruno Costa"
      }
    },
    {
      id: "9",
      date: setTime(14, 30),
      duration: 90,
      status: "SCHEDULED",
      barberId: "6",
      user: {
        name: "Eduardo Silva",
        image: null,
        phone: "(11) 99999-9999"
      },
      service: {
        name: "Relaxamento + Corte",
        duration: 90
      },
      barber: {
        name: "Felipe Souza"
      }
    },
    {
      id: "10",
      date: setTime(15, 0),
      duration: 60,
      status: "SCHEDULED",
      barberId: "1",
      user: {
        name: "Gabriel Santos",
        image: null,
        phone: "(11) 98888-8888"
      },
      service: {
        name: "Corte Navalhado",
        duration: 60
      },
      barber: {
        name: "João Silva"
      }
    },
    {
      id: "11",
      date: setTime(16, 0),
      duration: 120,
      status: "SCHEDULED",
      barberId: "2",
      user: {
        name: "Antônio Carlos de Souza Filho",
        image: null,
        phone: "(11) 97777-7777"
      },
      service: {
        name: "Alisamento + Corte",
        duration: 120
      },
      barber: {
        name: "Pedro Santos"
      }
    },
    {
      id: "12",
      date: setTime(17, 30),
      duration: 60,
      status: "SCHEDULED",
      barberId: "4",
      user: {
        name: "Thiago Mendes",
        image: null,
        phone: "(11) 96666-6666"
      },
      service: {
        name: "Corte + Sobrancelha",
        duration: 60
      },
      barber: {
        name: "André Martins"
      }
    },
    {
      id: "13",
      date: setTime(18, 0),
      duration: 60,
      status: "SCHEDULED",
      barberId: "5",
      user: {
        name: "Pedro Augusto",
        image: null,
        phone: "(11) 95555-5555"
      },
      service: {
        name: "Corte Infantil",
        duration: 60
      },
      barber: {
        name: "Bruno Costa"
      }
    },
    {
      id: "14",
      date: setTime(19, 0),
      duration: 60,
      status: "SCHEDULED",
      barberId: "6",
      user: {
        name: "Leonardo Batista",
        image: null,
        phone: "(11) 94444-4444"
      },
      service: {
        name: "Corte + Barba",
        duration: 60
      },
      barber: {
        name: "Felipe Souza"
      }
    }
  ]

  // Filtrar próximos clientes (próximas 2 horas)
  const currentTime = new Date()
  const nextTwoHours = new Date()
  nextTwoHours.setHours(nextTwoHours.getHours() + 2)
  
  const upcomingBookings = mockBookings.filter(
    booking => booking.date >= currentTime && booking.date <= nextTwoHours
  )

  return (
    <>
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
            <QuickActions />
          </div>

          {/* Coluna 2-3: Grid de Agenda */}
          <div className="lg:col-span-2">
            <AgendaGrid bookings={mockBookings} barbers={mockBarbers} />
          </div>
        </div>
      </div>
    </>
  )
}