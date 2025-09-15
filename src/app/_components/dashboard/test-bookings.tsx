"use client"

import { Button } from "@/app/_components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Dice1, Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface TestBookingsProps {
  barbers: Array<{ id: string; name: string }>
}

export default function TestBookings({ barbers }: TestBookingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Serviços disponíveis para teste
  const services = [
    { name: "Corte de Cabelo", duration: 30 },
    { name: "Barba", duration: 30 },
    { name: "Corte + Barba", duration: 60 },
    { name: "Progressiva", duration: 90 },
    { name: "Coloração", duration: 120 },
    { name: "Luzes", duration: 150 },
    { name: "Relaxamento", duration: 90 },
    { name: "Hidratação", duration: 60 },
    { name: "Corte Infantil", duration: 45 },
    { name: "Sobrancelha", duration: 15 },
  ]

  // Nomes aleatórios para clientes
  const clientNames = [
    "João Silva", "Pedro Santos", "Carlos Oliveira", "André Martins",
    "Bruno Costa", "Felipe Souza", "Ricardo Lima", "Marcelo Alves",
    "Gabriel Santos", "Lucas Ferreira", "Rafael Pereira", "Thiago Mendes",
    "Eduardo Silva", "Roberto Nascimento", "Paulo Henrique", "Fernando Lima",
    "Antonio Carlos", "José Santos", "Francisco Costa", "Daniel Rodrigues"
  ]

  // Status possíveis
  const statuses = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]

  // Função para gerar horário aleatório do dia
  const getRandomTime = () => {
    const hour = Math.floor(Math.random() * 12) + 8 // Entre 8h e 20h
    const minute = Math.random() > 0.5 ? 0 : 30 // 00 ou 30 minutos
    const date = new Date()
    date.setHours(hour, minute, 0, 0)
    return date
  }

  // Função para verificar se horário está ocupado
  const isTimeSlotAvailable = async (barberId: string, date: Date, duration: number) => {
    try {
      const response = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barberId, date, duration })
      })
      const data = await response.json()
      return data.available
    } catch {
      // Se falhar, assume que está disponível (para teste)
      return true
    }
  }

  // Função para criar agendamentos de teste
  const createTestBookings = async () => {
    setIsLoading(true)

    try {
      // Selecionar 3 barbeiros aleatórios
      const selectedBarbers = [...barbers]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(3, barbers.length))

      const bookingsToCreate = []

      for (const barber of selectedBarbers) {
        // Criar 2-4 agendamentos por barbeiro
        const numBookings = Math.floor(Math.random() * 3) + 2

        for (let i = 0; i < numBookings; i++) {
          const service = services[Math.floor(Math.random() * services.length)]
          const client = clientNames[Math.floor(Math.random() * clientNames.length)]
          const status = statuses[Math.floor(Math.random() * statuses.length)]

          let attempts = 0
          let date = getRandomTime()

          // Tentar encontrar um horário disponível (máximo 10 tentativas)
          while (attempts < 10) {
            const available = await isTimeSlotAvailable(barber.id, date, service.duration)
            if (available) break
            date = getRandomTime()
            attempts++
          }

          bookingsToCreate.push({
            barberId: barber.id,
            date: date.toISOString(),
            duration: service.duration,
            status,
            serviceName: service.name,
            clientName: client,
            // Preço aleatório entre 30 e 150
            price: Math.floor(Math.random() * 120) + 30
          })
        }
      }

      // Criar todos os agendamentos
      const response = await fetch('/api/bookings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookings: bookingsToCreate })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`${result.created} agendamentos de teste criados!`)
        // Recarregar a página para mostrar os novos agendamentos
        setTimeout(() => window.location.reload(), 1000)
      } else {
        throw new Error('Falha ao criar agendamentos')
      }
    } catch (error) {
      console.error('Erro ao criar agendamentos de teste:', error)
      toast.error('Erro ao criar agendamentos de teste')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para limpar agendamentos de teste
  const clearTestBookings = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch('/api/bookings/test', {
        method: 'DELETE'
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`${result.deleted} agendamentos de teste removidos!`)
        setTimeout(() => window.location.reload(), 1000)
      } else {
        throw new Error('Falha ao limpar agendamentos')
      }
    } catch (error) {
      console.error('Erro ao limpar agendamentos de teste:', error)
      toast.error('Erro ao limpar agendamentos de teste')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dice1 className="h-5 w-5" />
          Teste de Agendamentos
        </CardTitle>
        <CardDescription>
          Crie agendamentos aleatórios para testar a visualização da agenda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Seleciona 3 barbeiros aleatórios</p>
          <p>• Cria 2-4 agendamentos por barbeiro</p>
          <p>• Horários e serviços aleatórios</p>
          <p>• Status variados (agendado, em atendimento, concluído)</p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={createTestBookings}
            disabled={isLoading || barbers.length === 0}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Dice1 className="mr-2 h-4 w-4" />
                Lançar Teste
              </>
            )}
          </Button>

          <Button
            onClick={clearTestBookings}
            disabled={isDeleting}
            variant="destructive"
            size="icon"
            title="Limpar agendamentos de teste"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {barbers.length === 0 && (
          <p className="text-sm text-red-500">
            Nenhum barbeiro disponível para teste
          </p>
        )}
      </CardContent>
    </Card>
  )
}