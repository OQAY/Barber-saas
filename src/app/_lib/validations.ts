/**
 * Schemas de validação usando Zod
 * Garante type safety e validação robusta de inputs
 */

import { z } from "zod"

// Validações básicas
export const emailSchema = z
  .string()
  .email("Email inválido")
  .min(1, "Email é obrigatório")

export const passwordSchema = z
  .string()
  .min(6, "Senha deve ter pelo menos 6 caracteres")
  .max(100, "Senha muito longa")

export const phoneSchema = z
  .string()
  .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato de telefone inválido")
  .optional()

export const nameSchema = z
  .string()
  .min(2, "Nome deve ter pelo menos 2 caracteres")
  .max(100, "Nome muito longo")
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços")

// Schema para criação de booking
export const createBookingSchema = z.object({
  serviceId: z
    .string()
    .uuid("ID do serviço inválido")
    .min(1, "Serviço é obrigatório"),

  barberId: z
    .string()
    .uuid("ID do barbeiro inválido")
    .min(1, "Barbeiro é obrigatório"),

  date: z
    .date()
    .min(new Date(), "Data deve ser no futuro")
    .refine(
      (date) => {
        const now = new Date()
        const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60)
        return diffInHours >= 1 // Pelo menos 1 hora de antecedência
      },
      "Agendamento deve ser feito com pelo menos 1 hora de antecedência"
    )
    .refine(
      (date) => {
        const dayOfWeek = date.getDay()
        return dayOfWeek >= 1 && dayOfWeek <= 6 // Segunda a Sábado
      },
      "Agendamentos só são permitidos de segunda a sábado"
    )
    .refine(
      (date) => {
        const hours = date.getHours()
        return hours >= 9 && hours < 19 // 9h às 18h
      },
      "Agendamentos só são permitidos entre 9h e 18h"
    ),

  notes: z
    .string()
    .max(500, "Observações muito longas")
    .optional(),
})

// Schema para cancelamento de booking
export const cancelBookingSchema = z.object({
  bookingId: z
    .string()
    .uuid("ID do agendamento inválido")
    .min(1, "ID do agendamento é obrigatório"),
})

// Schema para registro de usuário
export const registerUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
})

// Schema para login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Senha é obrigatória"),
})

// Schema para criação de barbeiro
export const createBarberSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  bio: z
    .string()
    .max(500, "Bio muito longa")
    .optional(),
  specialties: z
    .array(z.string())
    .min(1, "Pelo menos uma especialidade é obrigatória")
    .max(5, "Máximo 5 especialidades"),
  barbershopId: z
    .string()
    .uuid("ID da barbearia inválido"),
})

// Schema para atualização de perfil de usuário
export const updateUserProfileSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema,
  email: emailSchema.optional(),
})

// Schema para criação de serviço
export const createServiceSchema = z.object({
  name: z
    .string()
    .min(2, "Nome do serviço deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),

  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(500, "Descrição muito longa"),

  price: z
    .number()
    .positive("Preço deve ser positivo")
    .max(1000, "Preço muito alto")
    .refine(
      (price) => Number(price.toFixed(2)) === price,
      "Preço deve ter no máximo 2 casas decimais"
    ),

  duration: z
    .number()
    .int("Duração deve ser um número inteiro")
    .min(15, "Duração mínima de 15 minutos")
    .max(240, "Duração máxima de 4 horas"),

  barbershopId: z
    .string()
    .uuid("ID da barbearia inválido"),
})

// Schema para busca/filtros
export const searchSchema = z.object({
  query: z
    .string()
    .max(100, "Busca muito longa")
    .optional(),

  location: z
    .string()
    .max(100, "Localização muito longa")
    .optional(),

  service: z
    .string()
    .max(50, "Serviço inválido")
    .optional(),

  priceRange: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    })
    .optional(),
})

// Tipos TypeScript derivados dos schemas
export type CreateBookingData = z.infer<typeof createBookingSchema>
export type CancelBookingData = z.infer<typeof cancelBookingSchema>
export type RegisterUserData = z.infer<typeof registerUserSchema>
export type LoginData = z.infer<typeof loginSchema>
export type CreateBarberData = z.infer<typeof createBarberSchema>
export type UpdateUserProfileData = z.infer<typeof updateUserProfileSchema>
export type CreateServiceData = z.infer<typeof createServiceSchema>
export type SearchData = z.infer<typeof searchSchema>

// Helper function para validação segura
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err =>
        err.path.length > 0
          ? `${err.path.join('.')}: ${err.message}`
          : err.message
      )
      return { success: false, errors }
    }
    return { success: false, errors: ["Erro de validação desconhecido"] }
  }
}

// Helper para validação de datas de agendamento
export function isValidBookingTime(date: Date): boolean {
  const now = new Date()
  const dayOfWeek = date.getDay()
  const hours = date.getHours()
  const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60)

  return (
    diffInHours >= 1 && // Pelo menos 1 hora de antecedência
    dayOfWeek >= 1 && dayOfWeek <= 6 && // Segunda a Sábado
    hours >= 9 && hours < 19 // 9h às 18h
  )
}

// Helper para sanitização de strings
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Remove espaços extras
    .replace(/[<>]/g, '') // Remove caracteres perigosos
}

// Helper para validação de CPF (opcional)
export const cpfSchema = z
  .string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido")
  .refine((cpf) => {
    // Validação básica de CPF
    const numbers = cpf.replace(/\D/g, '')
    if (numbers.length !== 11 || /^(\d)\1{10}$/.test(numbers)) return false

    // Algoritmo de validação do CPF
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i)
    }
    let remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(numbers[9])) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i)
    }
    remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0

    return remainder === parseInt(numbers[10])
  }, "CPF inválido")
  .optional()