import Header from "./_components/layout/header"
import { Button } from "./_components/ui/button"
import Image from "next/image"
import { db } from "./_lib/prisma"
import BarberItem from "./_components/staff/barber-item"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking/booking-item"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "../app/_lib/Auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function Home() {
  // Obtem a sessão do usuário
  const session = await getServerSession(authOptions)

  // Busca os barbeiros através da barbearia e os agendamentos confirmados do usuário
  const [barbershopWithBarbers, bookings] = await Promise.all([
    db.barbershop.findFirst({
      include: {
        barbers: {
          where: {
            isActive: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    }),
    session?.user
      ? db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: {
              include: {
                barbershop: true,
              },
            },
          },
        })
      : Promise.resolve([]),
  ])

  const barbers = barbershopWithBarbers?.barbers || []

  return (
    <div>
      <Header />

      {/* Seção de boas-vindas */}
      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">
          {session?.user
            ? `Olá, ${session.user.name?.split(" ")[0]}!`
            : "Olá! Vamos agendar um corte hoje?"}
        </h2>
        <p className="text-sm capitalize">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>

      {/* Categorias de serviços */}
      <div className="mt-6 flex gap-3 overflow-x-scroll px-2 [&::-webkit-scrollbar]:hidden">
        {quickSearchOptions.map((option) => (
          <Button
            className="gap-2"
            variant="secondary"
            key={option.title}
            asChild
          >
            <Link href={`/barbers?service=${option.title}`}>
              <Image
                src={option.imageUrl}
                width={16}
                height={16}
                alt={option.title}
              />
              {option.title}
            </Link>
          </Button>
        ))}
      </div>

      {/* Imagem do banner */}
      <div className="relative mt-6 h-[150px] w-full">
        <Image
          src="/banner-01.png"
          alt="Agende nos melhores com FSW Barber"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-xl object-cover"
        />
      </div>

      {/* Seção de agendamentos */}
      {bookings.length > 0 ? (
        <>
          <h2 className="mb-3 pl-5 pt-6 text-xs font-bold uppercase text-gray-400">
            Agendamentos
          </h2>
          <div className="flex gap-3 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
            {bookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </>
      ) : (
        <p className="pl-5 pt-6 text-gray-500">
          Você não tem agendamentos futuros.
        </p>
      )}

      {/* Nossos Barbeiros */}
      <div className="mb-[4.5rem] mt-6">
        <h2 className="mb-3 px-5 text-xs font-bold uppercase text-gray-400">
          Nossos Barbeiros
        </h2>

        {barbers.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 px-5">
            {barbers.map((barber) => (
              <BarberItem key={barber.id} barber={barber} />
            ))}
          </div>
        ) : (
          <div className="px-5">
            <p className="text-gray-500 text-center py-8">
              Nenhum barbeiro disponível no momento. Total encontrados: {barbers.length}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
