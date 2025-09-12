interface SpecialtyOption {
  imageUrl: string
  title: string
}

export const specialtyOptions: SpecialtyOption[] = [
  {
    imageUrl: "/cabelo.svg",
    title: "Cabelo",
  },
  {
    imageUrl: "/barba.svg",
    title: "Barba",
  },
  {
    imageUrl: "/acabamento.svg",
    title: "Pezinho",
  },
  {
    imageUrl: "/visagismo.svg",
    title: "Visagismo",
  },
  {
    imageUrl: "/infantil.svg",
    title: "Infantil",
  },
  {
    imageUrl: "/massagem.svg",
    title: "Spa Capilar",
  },
  {
    imageUrl: "/sobrancelha.svg",
    title: "Sobrancelha",
  },
  {
    imageUrl: "/hidratacao.svg",
    title: "Hidratação",
  },
  {
    imageUrl: "/coloracao.svg",
    title: "Coloração",
  },
  {
    imageUrl: "/acabamento.svg",
    title: "Acabamento",
  },
  {
    imageUrl: "/massagem.svg",
    title: "Massagem",
  },
]

// Função helper para buscar o ícone da especialidade
export function getSpecialtyIcon(specialty: string): string {
  const found = specialtyOptions.find(
    option => option.title.toLowerCase() === specialty.toLowerCase()
  )
  return found ? found.imageUrl : "/cabelo.svg" // default icon
}