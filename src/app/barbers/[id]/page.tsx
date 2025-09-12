import PhoneItem from "@/app/_components/common/phone-item"
import ServiceItem from "@/app/_components/establishments/service-items"
import SidebarButton from "@/app/_components/layout/sidebar-sheet"
import { Button } from "@/app/_components/ui/button"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet"
import { db } from "@/app/_lib/prisma"
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon, UserIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/app/_components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { Badge } from "@/app/_components/ui/badge"

interface BarberPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: BarberPageProps) {
  const barber = await db.barber.findUnique({
    where: { id: params.id },
    select: { name: true, photo: true }
  })
  
  return {
    title: barber?.name || 'Barbeiro',
    openGraph: {
      images: barber?.photo ? [barber.photo] : [],
    },
  }
}

const BarberPage = async ({ params }: BarberPageProps) => {
  // Busca o barbeiro e a barbearia relacionada
  const barber = await db.barber.findUnique({
    where: {
      id: params.id,
    },
    include: {
      barbershop: {
        include: {
          services: true,
        },
      },
    },
  })

  if (!barber) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-red-500 mb-4">Barbeiro não encontrado</p>
        <Link href="/">
          <Button variant="outline">Voltar para Home</Button>
        </Link>
      </div>
    )
  }

  // Converte Decimal para number para evitar erro de serialização
  const barbershop = {
    ...barber.barbershop,
    services: barber.barbershop.services.map(service => ({
      ...service,
      price: Number(service.price)
    }))
  }

  return (
    <div className="min-h-screen">
      {/* Header com imagem de fundo */}
      <div className="relative h-[250px] w-full">
        <Image
          src={barbershop.imageUrl}
          fill
          priority
          className="object-cover brightness-50"
          alt={barbershop.name}
        />

        {/* Botão Voltar */}
        <Button
          asChild
          size="icon"
          variant="secondary"
          className="absolute left-4 top-4"
        >
          <Link href="/#barbers-section">
            <ChevronLeftIcon />
          </Link>
        </Button>

        {/* Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-4 top-4"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SidebarButton />
        </Sheet>

        {/* Info do Barbeiro sobreposta */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3">
            <div className="relative h-20 w-20 rounded-full border-2 border-primary overflow-hidden bg-secondary">
              {barber.photo ? (
                <Image
                  src={barber.photo}
                  alt={barber.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <UserIcon className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{barber.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="gap-1">
                  <StarIcon className="h-3 w-3 fill-primary text-primary" />
                  5.0
                </Badge>
                <span className="text-sm text-white/80">(47 avaliações)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sobre o Barbeiro */}
      <div className="p-4">
        <h2 className="text-xs font-bold uppercase text-muted-foreground mb-3">
          Sobre o Profissional
        </h2>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm leading-relaxed text-justify">
              {barber.bio || 
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
              }
            </p>
            
            {/* Especialidades */}
            <div className="mt-4">
              <p className="text-xs font-semibold mb-2">Especialidades:</p>
              <div className="flex flex-wrap gap-2">
                {barber.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Serviços Disponíveis */}
      <div className="p-4">
        <h2 className="text-xs font-bold uppercase text-muted-foreground mb-3">
          Serviços Disponíveis
        </h2>
        <div className="space-y-3">
          {barber.barbershop.services
            .filter((service) => {
              // Filtra serviços baseado nas especialidades do barbeiro
              const serviceCategory = service.name.toLowerCase()
              return barber.specialties.some(specialty => 
                serviceCategory.includes(specialty.toLowerCase()) ||
                specialty.toLowerCase().includes(serviceCategory)
              )
            })
            .map((service) => (
              <ServiceItem
                key={service.id}
                barbershop={barbershop}
                service={service}
                barberId={barber.id}
              />
            ))}
          
          {/* Se não houver filtro específico, mostra todos os serviços */}
          {barber.barbershop.services.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum serviço disponível no momento.
            </p>
          )}
        </div>
      </div>

      {/* Horários Disponíveis */}
      <div className="p-4">
        <h2 className="text-xs font-bold uppercase text-muted-foreground mb-3">
          Horários de Atendimento
        </h2>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Segunda a Sexta</span>
                <span className="font-medium">09:00 - 19:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sábado</span>
                <span className="font-medium">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Domingo</span>
                <span className="font-medium">Fechado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contato */}
      <div className="p-4 pb-8">
        <h2 className="text-xs font-bold uppercase text-muted-foreground mb-3">
          Contato
        </h2>
        <Card>
          <CardContent className="p-4 space-y-2">
            {barbershop.phones.map((phone, index) => (
              <PhoneItem key={`${phone}-${index}`} phone={phone} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BarberPage