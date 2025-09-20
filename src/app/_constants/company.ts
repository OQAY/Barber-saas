/**
 * Constantes da empresa
 * Centralizadas para facilitar manutenção e evitar valores hardcoded
 */

export const COMPANY = {
  name: "FSW Barber",
  displayName: "FSW Barber",
  description: "A melhor barbearia da região",
  website: "https://fsw-barber.vercel.app",

  // Informações de contato
  contact: {
    email: "contato@fswbarber.com",
    phone: "(11) 99999-9999",
  },

  // Configurações de negócio
  business: {
    defaultBookingDuration: 60, // minutos
    openingHours: {
      start: "09:00",
      end: "19:00"
    },
    workingDays: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
  }
} as const

// Helper para usar em diferentes contextos
export const getCompanyName = () => COMPANY.name
export const getCompanyDisplayName = () => COMPANY.displayName