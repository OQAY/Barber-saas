"use client"

import { Button } from "@/app/_components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { Calendar } from "@/app/_components/ui/calendar"
import { Dice1, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface TestBookingsDialogProps {
  barbers: Array<{ id: string; name: string }>
}

export default function TestBookingsDialog({ barbers }: TestBookingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState<number>(5)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Serviços disponíveis para teste
  const services = [
    { name: "Corte de Cabelo", duration: 30 },
    { name: "Barba", duration: 30 },
    { name: "Corte + Barba", duration: 60 },
    { name: "Hidratação", duration: 60 },
  ]

  // Nomes aleatórios para clientes
  const clientNames = [
    "João Silva", "Pedro Santos", "Carlos Oliveira", "André Martins",
    "Bruno Costa", "Felipe Souza", "Ricardo Lima", "Marcelo Alves",
    "Gabriel Santos", "Lucas Ferreira", "Rafael Pereira", "Thiago Mendes",
  ]

  // Status possíveis
  const statuses = ["SCHEDULED", "IN_PROGRESS", "COMPLETED"]

  // Função para gerar horário aleatório do dia selecionado
  const getRandomTime = (date: Date) => {
    const hour = Math.floor(Math.random() * 12) + 8 // Entre 8h e 20h
    const minute = Math.random() > 0.5 ? 0 : 30 // 00 ou 30 minutos
    const newDate = new Date(date)
    newDate.setHours(hour, minute, 0, 0)
    return newDate
  }

  // Função para criar agendamentos de teste
  const createTestBookings = async () => {
    if (!selectedDate) {
      toast.error("Selecione uma data")
      return
    }

    if (quantity < 1 || quantity > 50) {
      toast.error("Quantidade deve ser entre 1 e 50")
      return
    }

    setIsLoading(true)

    try {
      const bookingsToCreate = []

      for (let i = 0; i < quantity; i++) {
        // Selecionar barbeiro aleatório
        const barber = barbers[Math.floor(Math.random() * barbers.length)]
        const service = services[Math.floor(Math.random() * services.length)]
        const client = clientNames[Math.floor(Math.random() * clientNames.length)]
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const date = getRandomTime(selectedDate)

        bookingsToCreate.push({
          barberId: barber.id,
          date: date.toISOString(),
          duration: service.duration,
          status,
          serviceName: service.name,
          clientName: client,
          price: Math.floor(Math.random() * 120) + 30
        })
      }

      // Criar todos os agendamentos
      const response = await fetch('/api/bookings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookings: bookingsToCreate })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`${result.created} agendamentos criados!`)
        setIsOpen(false)
        setTimeout(() => window.location.reload(), 500)
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="justify-start gap-2 w-full">
          <Dice1 size={18} />
          Gerar Testes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerar Agendamentos de Teste</DialogTitle>
          <DialogDescription>
            Crie agendamentos aleatórios para testar a agenda
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quantidade */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade de agendamentos</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="50"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              placeholder="Ex: 5"
            />
            <p className="text-xs text-muted-foreground">
              Serão distribuídos aleatoriamente entre os barbeiros
            </p>
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label>Data dos agendamentos</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border"
            />
            <p className="text-xs text-muted-foreground">
              {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={createTestBookings}
            disabled={isLoading || barbers.length === 0}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Dice1 className="mr-2 h-4 w-4" />
                Gerar
              </>
            )}
          </Button>
        </div>

        {barbers.length === 0 && (
          <p className="text-sm text-red-500 text-center">
            Nenhum barbeiro disponível
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
