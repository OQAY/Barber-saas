import Image from "next/image"
import { Card, CardContent } from "../ui/card"
import { CheckCircleIcon, AwardIcon, UsersIcon, ScissorsIcon } from "lucide-react"

const AboutSection = () => {
  const features = [
    {
      icon: ScissorsIcon,
      title: "Profissionais Experientes",
      description: "Barbeiros com mais de 8 anos de experiência"
    },
    {
      icon: AwardIcon,
      title: "Qualidade Garantida",
      description: "Produtos premium e técnicas modernas"
    },
    {
      icon: UsersIcon,
      title: "+5000 Clientes",
      description: "Satisfação comprovada desde 2020"
    }
  ]

  return (
    <section className="bg-background py-8 md:py-12">
      <div className="container mx-auto px-5">
        {/* Título da seção mais compacto */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-1 md:text-2xl">Por que escolher a FSW Barber?</h2>
          <p className="text-muted-foreground text-xs md:text-sm">
            Tradição e inovação em cada detalhe
          </p>
        </div>

        {/* Grid com 3 cards mais compactos */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-muted/50 bg-card/50">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-2 md:p-3">
                    <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-xs md:text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground hidden md:block">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seção com imagens e texto mais compacta */}
        <div className="rounded-xl bg-secondary/30 p-4 md:p-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center">
            {/* Texto mais conciso */}
            <div className="order-2 md:order-1">
              <h3 className="text-lg font-bold mb-3 md:text-xl">
                Mais que um corte, uma experiência
              </h3>
              <p className="text-muted-foreground mb-3 text-xs md:text-sm">
                Cada visita é um momento só seu. Relaxe enquanto cuidamos do resto.
              </p>
              <ul className="space-y-1.5 text-xs md:text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Seu horário sempre respeitado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Agende sem filas pelo app</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Só trabalhamos com o melhor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Cafézinho na faixa</span>
                </li>
              </ul>
            </div>

            {/* Grid de 3 imagens menores */}
            <div className="order-1 md:order-2">
              <div className="grid grid-cols-2 gap-2">
                {/* Imagem principal */}
                <div className="col-span-2 relative h-32 md:h-48 rounded-lg overflow-hidden">
                  <Image
                    src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
                    alt="Interior da barbearia"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Duas imagens menores */}
                <div className="relative h-24 md:h-32 rounded-lg overflow-hidden">
                  <Image
                    src="https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png"
                    alt="Barbeiro trabalhando"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-24 md:h-32 rounded-lg overflow-hidden">
                  <Image
                    src="https://utfs.io/f/0522fdaf-0357-4213-8f52-1d83c3dcb6cd-18e.png"
                    alt="Produtos premium"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action mais sutil */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground text-xs md:text-sm">
            Faça parte da família FSW Barber
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutSection