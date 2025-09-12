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
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-5">
        {/* Título da seção */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 md:text-3xl">Por que escolher a FSW Barber?</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Tradição e inovação em cada detalhe do seu visual
          </p>
        </div>

        {/* Grid com 3 cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 mb-10">
          {features.map((feature, index) => (
            <Card key={index} className="border-muted/50 bg-card/50">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-3">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seção com imagens e texto */}
        <div className="rounded-2xl bg-secondary/30 p-6 md:p-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
            {/* Texto */}
            <div className="order-2 md:order-1">
              <h3 className="text-xl font-bold mb-4 md:text-2xl">
                Um espaço criado para você
              </h3>
              <p className="text-muted-foreground mb-4 text-sm md:text-base">
                Nossa barbearia combina o melhor do tradicional com o contemporâneo. 
                Aqui, cada detalhe foi pensado para proporcionar uma experiência única.
              </p>
              <ul className="space-y-2 text-sm md:text-base">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Ambiente climatizado e confortável</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Agendamento online prático e rápido</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Produtos importados de alta qualidade</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Café e bebidas cortesia</span>
                </li>
              </ul>
            </div>

            {/* Grid de 3 imagens */}
            <div className="order-1 md:order-2">
              <div className="grid grid-cols-2 gap-3">
                {/* Imagem principal grande */}
                <div className="col-span-2 relative h-48 md:h-64 rounded-xl overflow-hidden">
                  <Image
                    src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
                    alt="Interior da barbearia"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Duas imagens menores */}
                <div className="relative h-32 md:h-40 rounded-xl overflow-hidden">
                  <Image
                    src="https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png"
                    alt="Barbeiro trabalhando"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 md:h-40 rounded-xl overflow-hidden">
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

        {/* Call to Action sutil */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            Venha conhecer e fazer parte da família FSW Barber
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutSection