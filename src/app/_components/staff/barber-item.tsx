import { Barber } from "@prisma/client"
import { Card, CardContent } from "../ui/card"
import Image from "next/image"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { StarIcon } from "lucide-react"
import Link from "next/link"

interface BarberItemProps {
  barber: Barber
}

// Função para criar slug a partir do nome (temporária até migração)
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

const BarberItem = ({ barber }: BarberItemProps) => {
  // Usa o slug se existir, senão gera um baseado no nome
  const barberSlug = barber.slug || createSlug(barber.name)
  
  return (
    <Card className="min-w-[110px] rounded-2xl">
      <CardContent className="p-0 px-1 pt-1">
        {/* IMAGEM - 60% */}
        <div className="relative h-[100px] w-full">
          <Image
            fill
            alt={barber.name}
            className="rounded-2xl object-cover"
            src={barber.photo || "/default-barber.png"}
          />

          <Badge
            className="absolute left-2 top-2 space-x-1"
            variant="secondary"
          >
            <StarIcon size={12} className="fill-primary text-primary" />
            <p className="text-xs font-semibold">5,0</p>
          </Badge>
        </div>

        {/* NOME - 20% */}
        <div className="px-1 py-2">
          <h3 className="truncate text-sm font-semibold">{barber.name}</h3>
        </div>

        {/* BOTÃO - 20% */}
        <div className="px-1 pb-2">
          <Button variant="secondary" className="h-8 w-full text-xs" asChild>
            <Link href={`/barbers/${barberSlug}`}>
              Reservar
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarberItem