import Image from "next/image"
import { Button } from "../ui/button"
import { getSpecialtyIcon } from "@/app/_constants/specialties"

interface BarberSpecialtiesProps {
  specialties: string[]
  variant?: "button" | "badge"
}

const BarberSpecialties = ({ specialties, variant = "button" }: BarberSpecialtiesProps) => {
  if (variant === "badge") {
    // Estilo Badge para a página de detalhes
    return (
      <div className="flex flex-wrap gap-2">
        {specialties.map((specialty) => (
          <div
            key={specialty}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium"
          >
            <Image
              src={getSpecialtyIcon(specialty)}
              width={14}
              height={14}
              alt={specialty}
              className="opacity-70"
            />
            <span>{specialty}</span>
          </div>
        ))}
      </div>
    )
  }

  // Estilo Button (igual às categorias da home)
  return (
    <div className="flex flex-wrap gap-2">
      {specialties.map((specialty) => (
        <Button
          key={specialty}
          variant="secondary"
          size="sm"
          className="gap-2 cursor-default hover:bg-secondary"
        >
          <Image
            src={getSpecialtyIcon(specialty)}
            width={16}
            height={16}
            alt={specialty}
          />
          {specialty}
        </Button>
      ))}
    </div>
  )
}

export default BarberSpecialties