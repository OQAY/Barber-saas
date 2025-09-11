"use client"

import { Button } from "@/app/_components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"

const HeroSection = () => {
  const router = useRouter()

  const handleBooking = () => {
    // Scroll para a seção de barbeiros ou navegar para bookings
    const barbersSection = document.getElementById("barbers-section")
    if (barbersSection) {
      barbersSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image com overlay */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Barbearia FSW Barber"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay escuro para melhorar contraste do texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        {/* Logo e Nome */}
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="FSW Barber"
            width={200}
            height={30}
            className="mx-auto"
          />
        </div>

        {/* Tagline */}
        <p className="mb-8 max-w-2xl text-lg font-medium uppercase tracking-widest text-white/90 md:text-xl">
          Estilo é um reflexo da sua atitude e sua personalidade.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={handleBooking}
          className="bg-primary px-8 py-6 text-base font-semibold hover:bg-primary/90"
        >
          Agendar Horário
        </Button>
      </div>

      {/* Decorative bottom wave/curve (opcional) */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="h-16 w-full fill-background"
          preserveAspectRatio="none"
          viewBox="0 0 1440 54"
        >
          <path d="M0,22L48,27.7C96,33,192,45,288,47.2C384,49,480,41,576,33C672,25,768,17,864,21.5C960,26,1056,42,1152,42.2C1248,42,1344,26,1392,18L1440,10L1440,54L1392,54C1344,54,1248,54,1152,54C1056,54,960,54,864,54C768,54,672,54,576,54C480,54,384,54,288,54C192,54,96,54,48,54L0,54Z" />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection