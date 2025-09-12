import { Card, CardContent } from "../ui/card"
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-secondary/50 mt-auto border-t">
      <div className="px-5 py-6 md:container md:mx-auto md:py-8">
        {/* Mobile: 2 colunas | Desktop: 4 colunas */}
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4 md:gap-8">
          {/* Logo e Descrição - ocupa 2 colunas no mobile */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-2 font-bold md:mb-3 md:text-base">FSW Barber</h3>
            <p className="text-xs text-muted-foreground md:text-sm">
              Onde estilo encontra tradição. Desde 2020.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-2 font-semibold md:mb-3 md:text-base">Contato</h3>
            <div className="space-y-1 text-xs text-muted-foreground md:text-sm">
              <a href="tel:1199991234" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <PhoneIcon className="h-3 w-3" />
                <span>(11) 99999-1234</span>
              </a>
              <a href="mailto:contato@fswbarber.com" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <MailIcon className="h-3 w-3" />
                <span className="truncate">contato@fswbarber.com</span>
              </a>
            </div>
          </div>

          {/* Horários */}
          <div>
            <h3 className="mb-2 font-semibold md:mb-3 md:text-base">Horários</h3>
            <div className="space-y-0.5 text-xs text-muted-foreground md:text-sm">
              <p>
                <span className="font-medium">Seg-Sex:</span> 09:00 - 19:00
              </p>
              <p>
                <span className="font-medium">Sábado:</span> 09:00 - 18:00
              </p>
              <p>
                <span className="font-medium">Domingo:</span> Fechado
              </p>
            </div>
          </div>

          {/* Endereço - ocupa 2 colunas no mobile */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-2 font-semibold md:mb-3 md:text-base">Endereço</h3>
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground md:text-sm">
              <MapPinIcon className="mt-0.5 h-3 w-3 flex-shrink-0" />
              <span>
                Rua dos Barbeiros, 123 - Centro<br />
                São Paulo, SP - CEP: 01234-567
              </span>
            </div>
          </div>
        </div>

        {/* Linha divisória mais sutil */}
        <div className="my-4 border-t border-border/50 md:my-6" />

        {/* Copyright mais compacto */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground md:text-sm">
            © 2025 FSW Barber. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
