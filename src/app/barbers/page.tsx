import BarberItem from "../_components/staff/barber-item"
import Header from "../_components/layout/header"
import { db } from "../_lib/prisma"

interface BarbersPageProps {
  searchParams: {
    service?: string
  }
}

const BarbersPage = async ({ searchParams }: BarbersPageProps) => {
  // Busca barbeiros no banco de dados com base no serviço
  const barbers = await db.barber.findMany({
    where: searchParams?.service
      ? {
          specialties: {
            has: searchParams.service,
          },
          isActive: true,
        }
      : {
          isActive: true,
        },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div>
      <Header />
      <div className="px-5">
        <h1 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          {searchParams?.service 
            ? `Barbeiros especialistas em ${searchParams.service}`
            : "Todos os Barbeiros"
          }
        </h1>
        <div className="grid grid-cols-3 gap-3">
          {barbers.map((barber) => (
            <BarberItem key={barber.id} barber={barber} />
          ))}
        </div>
        {barbers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchParams?.service 
                ? `Nenhum barbeiro especialista em ${searchParams.service} encontrado.`
                : "Nenhum barbeiro encontrado."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BarbersPage